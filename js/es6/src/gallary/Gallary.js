import gallaryTemplate from './templates/gallary.mustache';
import './styles/style.css';
import arrowLeft from './images/arrowLeft.png';
import arrowRight from './images/arrowRight.png';

export default class Gallary {
    constructor(options) {
        this.count = 0;
        this.photoGap = 10;
        this.options = options;
        this.container = options.container;
        this.countGap = Math.floor(this.options.size/2);
        const hostId = this.container.id;
        this.photoWidth = (0.8 * this.container.clientWidth - this.photoGap * options.size) / options.size;
        const controllWidth = 0.05 * this.container.clientWidth;

        const dpi = Math.floor(window.devicePixelRatio);
        this.gallaryTemplate = gallaryTemplate({
            photos: options.photos.map((photo)=>{
                const ph = photo;
                ph.src = ph.src.replace('.jpg',dpi > 1 ? `_x${dpi}.jpg` : ".jpg");
                return ph;
            }),
            photoWidth: this.photoWidth,
            arrowLeft: arrowLeft,
            arrowRight: arrowRight,
            controllWidth: controllWidth,
            hostId: hostId
        });
        this.container.innerHTML = this.gallaryTemplate;

        this.photosList = document.querySelector(`#${hostId}_photosList`);
        this.arrowLeft = document.querySelector(`#${hostId}_arrowLeft`);
        this.arrowRight = document.querySelector(`#${hostId}_arrowRight`);

        this.photos = document.querySelectorAll(`.gallary-mustache__photo img`);

        this.photos.addEventListener('click', (event) => {
            this.onSelectImage(event)
        });

        this.arrowLeft.addEventListener('click', () => {
            this.onPrev()
        });
        this.arrowRight.addEventListener('click', () => {
            this.onNext()
        });
        this.setSelectedImage(this.countGap);

        document.addEventListener('keydown', (event)=>{this.onKeyDown(event.code)});
    }

    onKeyDown(keyCode){
        switch (keyCode) {
            case "ArrowLeft":
                this.onPrev();
                break;
            case "ArrowRight":
                this.onNext();
                break;
            default:
                break;
        }
    }

    setSelectedImage(selectedId){
        this.photoCount = selectedId;
        this.photos.clearSelection();
        this.photos[selectedId].style.border = "2px solid #eef910";
    }

    onSelectImage(event) {
        const selectedId = event.target.getAttribute('photo');
        this.setSelectedImage(selectedId);
        if(selectedId >= this.countGap  && selectedId<(this.options.photos.length - this.countGap)){
            const count = this.countGap -selectedId;
            this.count = count;
            this.photosList.style.transform = `translateX(${(this.photoWidth + this.photoGap) * this.count}px)`;
        }
    }

    onNext() {
        if(this.photoCount<this.options.photos.length - 1){
            this.photoCount++
            this.setSelectedImage(this.photoCount);
            if (Math.abs(this.count) < this.options.photos.length - this.options.size) {
                this.count--;
                this.photosList.style.transform = `translateX(${(this.photoWidth + this.photoGap) * this.count}px)`;
            }
        }
    }

    onPrev() {
        if(this.photoCount > 0 ){
            this.photoCount--
            this.setSelectedImage(this.photoCount);
            if (this.count < 0) {
                this.count++;
                this.photosList.style.transform = `translateX(${(this.photoWidth + this.photoGap) * this.count}px)`;
            }
        }

    }
}
NodeList.prototype.addEventListener = function (event_name, callback, useCapture) {
    for (var i = 0; i < this.length; i++) {
        this[i].addEventListener(event_name, callback, useCapture);
    }
};
NodeList.prototype.clearSelection = function () {
    for (var i = 0; i < this.length; i++) {
        this[i].style.border='unset';
    }
};

window.Gallary = Gallary;
