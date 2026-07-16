import { describe, expect, it } from 'vitest';
import { birthdayConfig } from './trips';

describe('birthday trip configuration', () => {
  it('keeps all 12 supplied photos in the numbered location order', () => {
    expect(birthdayConfig.stops.map(({ place, image, orientation }) => ({ place, file: image.split('/').at(-1), orientation }))).toEqual([
      { place: '海南 · 三亚', file: '01.jpg', orientation: 'landscape' },
      { place: '湖南 · 长沙', file: '02.jpg', orientation: 'landscape' },
      { place: '江苏 · 南京', file: '03.jpg', orientation: 'landscape' },
      { place: '江西 · 南昌', file: '04.jpg', orientation: 'landscape' },
      { place: '湖北 · 武汉', file: '05.jpg', orientation: 'landscape' },
      { place: '山东 · 济南', file: '06.jpg', orientation: 'landscape' },
      { place: '福建 · 厦门', file: '07.jpg', orientation: 'landscape' },
      { place: '福建 · 漳州', file: '08.jpg', orientation: 'landscape' },
      { place: '江苏 · 苏州', file: '09.jpg', orientation: 'portrait' },
      { place: '江西 · 上饶', file: '10.jpg', orientation: 'portrait' },
      { place: '越南 · 芽庄', file: '11.jpg', orientation: 'portrait' },
      { place: '新疆 · 伊犁', file: '12.jpg', orientation: 'wide' },
    ]);
  });
});
