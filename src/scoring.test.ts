import { describe, expect, it } from 'vitest'
import { decodeAnswers, encodeAnswers, score } from './scoring'

// Question order: work x3, resourcing x3, rights x3, alignment x3
const all = (n: number) => Array(12).fill(n)

describe('score', () => {
  it('all-healthy answers -> healthy verdict, no signals', () => {
    const r = score(all(0))
    expect(r.verdict).toBe('healthy')
    expect(r.mechanical).toBe(0)
    expect(r.environmental).toBe(0)
    expect(r.signals).toEqual([])
  })

  it('all-broken answers -> compound stall', () => {
    const r = score(all(3))
    expect(r.verdict).toBe('compound')
    expect(r.mechanical).toBe(18)
    expect(r.environmental).toBe(18)
    expect(r.signals).toHaveLength(12)
  })

  it('mechanical side broken, environmental healthy -> mechanical break', () => {
    const r = score([3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    expect(r.mechanical).toBe(8)
    expect(r.verdict).toBe('mechanical')
  })

  it('environmental side broken -> environmental block', () => {
    const r = score([0, 0, 0, 0, 0, 0, 3, 3, 2, 0, 0, 0])
    expect(r.environmental).toBe(8)
    expect(r.verdict).toBe('environmental')
  })

  it('one dimension at drift threshold -> early drift', () => {
    const r = score([2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    expect(r.dimensionScores.work).toBe(4)
    expect(r.verdict).toBe('drift')
  })

  it('just under all thresholds -> healthy', () => {
    // each dimension scores 3 (< 4), each side 6 (< 8)
    const r = score([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
    expect(r.verdict).toBe('healthy')
  })

  it('boundary: side score 7 does not trigger break', () => {
    const r = score([3, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    expect(r.mechanical).toBe(7)
    expect(r.verdict).toBe('drift') // work dimension is 7 >= 4
  })

  it('signals are sorted worst-first and only include scores >= 2', () => {
    const r = score([2, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    expect(r.signals).toHaveLength(2)
    // the 3-scored answer (question index 1) comes first
    expect(r.signals[0]).toMatch(/Scope has drifted/)
  })

  it('rejects wrong answer count and out-of-range values', () => {
    expect(() => score([1, 2])).toThrow()
    expect(() => score([...all(0).slice(0, 11), 4])).toThrow()
    expect(() => score([...all(0).slice(0, 11), -1])).toThrow()
  })
})

describe('hash encoding', () => {
  it('round-trips', () => {
    const answers = [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3]
    expect(decodeAnswers(encodeAnswers(answers))).toEqual(answers)
  })

  it('rejects malformed input', () => {
    expect(decodeAnswers('')).toBeNull()
    expect(decodeAnswers('01230123012')).toBeNull() // 11 digits
    expect(decodeAnswers('012301230124')).toBeNull() // digit out of range
    expect(decodeAnswers('abc301230123')).toBeNull()
  })
})
