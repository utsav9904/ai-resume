export interface CustomPageSize {
  widthMm: number;
  heightMm: number;
}

export interface PageDimension {
  widthMm: number;
  heightMm: number;
  aspectRatio: string;
  minHeight: string;
  label: string;
}

export const getPageCardDimensions = (
  pageSize: string = 'a4',
  customSize?: CustomPageSize
): PageDimension => {
  switch (pageSize) {
    case 'letter':
      return {
        widthMm: 215.9,
        heightMm: 279.4,
        aspectRatio: '215.9 / 279.4',
        minHeight: '990px',
        label: 'US Letter',
      };
    case 'legal':
      return {
        widthMm: 215.9,
        heightMm: 355.6,
        aspectRatio: '215.9 / 355.6',
        minHeight: '1260px',
        label: 'US Legal',
      };
    case 'executive':
      return {
        widthMm: 184.1,
        heightMm: 266.7,
        aspectRatio: '184.1 / 266.7',
        minHeight: '950px',
        label: 'Executive',
      };
    case 'custom': {
      const w = customSize?.widthMm || 210;
      const h = customSize?.heightMm || 297;
      const calcMinH = Math.round((h / 297) * 1050);
      return {
        widthMm: w,
        heightMm: h,
        aspectRatio: `${w} / ${h}`,
        minHeight: `${calcMinH}px`,
        label: `${w}×${h}mm`,
      };
    }
    case 'a4':
    default:
      return {
        widthMm: 210,
        heightMm: 297,
        aspectRatio: '210 / 297',
        minHeight: '1050px',
        label: 'A4',
      };
  }
};
