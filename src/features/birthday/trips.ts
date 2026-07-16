export interface TripStop {
  image: string;
  place: string;
  memory: string;
  orientation: 'portrait' | 'landscape' | 'wide';
  objectPosition?: string;
}

export interface BirthdayConfig {
  coverTitle: string;
  coverBody: string;
  stops: TripStop[];
}

export const birthdayConfig: BirthdayConfig = {
  coverTitle: '爸，先看 12 张\n熟悉的风景',
  coverBody: '这些年去过的地方，按顺序重新走一遍。',
  stops: [
    { image: `${import.meta.env.BASE_URL}trips/01.jpg`, place: '海南 · 三亚', memory: '热带雨林里站近一点，三个人刚好都进了镜头。', orientation: 'landscape' },
    { image: `${import.meta.env.BASE_URL}trips/02.jpg`, place: '湖南 · 长沙', memory: '一块碑站在中间，你们一左一右，队形很标准。', orientation: 'landscape' },
    { image: `${import.meta.env.BASE_URL}trips/03.jpg`, place: '江苏 · 南京', memory: '雨天登城墙，和老炮台也要认真合个影。', orientation: 'landscape' },
    { image: `${import.meta.env.BASE_URL}trips/04.jpg`, place: '江西 · 南昌', memory: '赶上傍晚的光，南昌之星先替大家入镜。', orientation: 'landscape' },
    { image: `${import.meta.env.BASE_URL}trips/05.jpg`, place: '湖北 · 武汉', memory: '黄鹤楼的夜景够亮，这张照片也算没白等。', orientation: 'landscape' },
    { image: `${import.meta.env.BASE_URL}trips/06.jpg`, place: '山东 · 济南', memory: '滑雪装备穿得很专业，先把标准照拍下来。', orientation: 'landscape' },
    { image: `${import.meta.env.BASE_URL}trips/07.jpg`, place: '福建 · 厦门', memory: '路过五老峰，顺便和一只正在修行的猫合了影。', orientation: 'landscape' },
    { image: `${import.meta.env.BASE_URL}trips/08.jpg`, place: '福建 · 漳州', memory: '站在高处看海，城市和海岸线都收进一张照片。', orientation: 'landscape' },
    { image: `${import.meta.env.BASE_URL}trips/09.jpg`, place: '江苏 · 苏州', memory: '园林里树石水面都很热闹，这张标准照拍得很稳。', orientation: 'portrait' },
    { image: `${import.meta.env.BASE_URL}trips/10.jpg`, place: '江西 · 上饶', memory: '云海到了脚下，三清宫的新禧钟也得亲手敲一下。', orientation: 'portrait' },
    { image: `${import.meta.env.BASE_URL}trips/11.jpg`, place: '越南 · 芽庄', memory: '路边停一下，椰子当然要趁新鲜喝。', orientation: 'portrait' },
    { image: `${import.meta.env.BASE_URL}trips/12.jpg`, place: '新疆 · 伊犁', memory: '雪山、草地和牛仔帽，最后一站很有收尾的样子。', orientation: 'wide' },
  ],
};
