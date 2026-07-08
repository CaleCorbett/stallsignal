import { describe, expect, it } from 'vitest'
import { decodeDrift, encodeDrift, scoreDrift } from './drift'

const all = (n: number) => Array(10).fill(n)

describe('scoreDrift', () => {
  it('no flags -> steady', () => {
    const r = scoreDrift(all(0))
    expect(r.verdict).toBe('steady')
    expect(r.total).toBe(0)
    expect(r.signals).toEqual([])
  })

  it('boundary: 2 flags -> steady, 3 flags -> confirmed', () => {
    expect(scoreDrift([1, 1, 0, 0, 0, 0, 0, 0, 0, 0]).verdict).toBe('steady')
    expect(scoreDrift([1, 1, 1, 0, 0, 0, 0, 0, 0, 0]).verdict).toBe('confirmed')
  })

  it('boundary: 5 flags -> confirmed, 6 flags -> systemic', () => {
    expect(scoreDrift([1, 1, 1, 1, 1, 0, 0, 0, 0, 0]).verdict).toBe('confirmed')
    expect(scoreDrift([1, 1, 1, 1, 1, 1, 0, 0, 0, 0]).verdict).toBe('systemic')
  })

  it('splits mechanical (first 5) and environmental (last 5)', () => {
    const r = scoreDrift([1, 1, 0, 0, 0, 0, 0, 0, 1, 1])
    expect(r.mechanical).toBe(2)
    expect(r.environmental).toBe(2)
    expect(r.total).toBe(4)
    expect(r.signals).toHaveLength(4)
  })

  it('all flags -> systemic 10', () => {
    const r = scoreDrift(all(1))
    expect(r.verdict).toBe('systemic')
    expect(r.total).toBe(10)
    expect(r.signals).toHaveLength(10)
  })

  it('rejects bad input', () => {
    expect(() => scoreDrift([1, 0])).toThrow()
    expect(() => scoreDrift([...all(0).slice(0, 9), 2])).toThrow()
  })
})

describe('drift hash encoding', () => {
  it('round-trips', () => {
    const picks = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
    expect(decodeDrift(encodeDrift(picks))).toEqual(picks)
  })

  it('rejects malformed input', () => {
    expect(decodeDrift('')).toBeNull()
    expect(decodeDrift('101010101')).toBeNull() // 9 digits
    expect(decodeDrift('1010101012')).toBeNull() // digit out of range
  })
})
