export interface TripStop { image: string; place: string; memory: string; objectPosition?: string }
export interface BirthdayConfig { coverTitle: string; coverBody: string; stops: TripStop[] }

export const birthdayConfig: BirthdayConfig = {
  coverTitle: '爸，先看几张\n熟悉的风景',
  coverBody: '这几年拍了不少照片，挑了几张给你。',
  stops: [
    { image: `${import.meta.env.BASE_URL}trips/01.jpg`, place: '杭州 · 西湖', memory: '那天走了两万步，你说“也就一般累”。' },
    { image: `${import.meta.env.BASE_URL}trips/02.jpg`, place: '北京 · 景山', memory: '为了拍这张照片，大家难得都没眨眼。' },
    { image: `${import.meta.env.BASE_URL}trips/03.jpg`, place: '厦门 · 环岛路', memory: '海风挺大，但没有影响你坚持拍照。' },
    { image: `${import.meta.env.BASE_URL}trips/04.jpg`, place: '苏州 · 平江路', memory: '走走停停，最后还是吃的记得最清楚。' },
    { image: `${import.meta.env.BASE_URL}trips/05.jpg`, place: '南京 · 玄武湖', memory: '这一天没赶行程，反而玩得最轻松。' },
    { image: `${import.meta.env.BASE_URL}trips/06.jpg`, place: '青岛 · 栈桥', memory: '你说海边都差不多，照片倒是一张没少拍。' },
    { image: `${import.meta.env.BASE_URL}trips/07.jpg`, place: '成都 · 人民公园', memory: '喝茶这件事，终于安排得比景点更重要。' },
    { image: `${import.meta.env.BASE_URL}trips/08.jpg`, place: '重庆 · 南山', memory: '路有点绕，好在最后没有错过夜景。' },
    { image: `${import.meta.env.BASE_URL}trips/09.jpg`, place: '桂林 · 漓江', memory: '这张风景照里，你站的位置选得最好。' },
    { image: `${import.meta.env.BASE_URL}trips/10.jpg`, place: '家 · 下一站', memory: '照片先放到这里，下一趟继续补上。' },
  ],
};
