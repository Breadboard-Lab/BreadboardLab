import {saveSvgAsPng, saveSvg} from './lib/saveSvg';

const exportSVG = () => {
    saveSvg(document.getElementById('AppSVG'), 'export.svg');
};

const exportPNG = () => {
    saveSvgAsPng(document.getElementById('AppSVG'), 'export.png');
};

export default exportSVG;