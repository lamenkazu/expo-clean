import { parseSeenTours, stepsFor } from '@core/domain/tours';

describe('tours', () => {
  it('le os tours ja vistos e ignora ids desconhecidos', () => {
    expect([...parseSeenTours('["start","nao-existe",3]')]).toEqual(['start']);
  });

  it('trata valor vazio ou invalido como nenhum tour visto', () => {
    expect(parseSeenTours(null).size).toBe(0);
    expect(parseSeenTours('{quebrado').size).toBe(0);
  });

  it('devolve os passos do tour', () => {
    expect(stepsFor('start').length).toBeGreaterThan(0);
  });
});
