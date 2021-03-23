gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
let bodyScrollBar;
const select = (e) => document.querySelector(e);
const selectAll = (e) => document.querySelectorAll(e);

function initNavigation() {
    const mainNavLinks = gsap.utils.toArray('.main-nav a');
    const mainNavLinksRev = gsap.utils.toArray('.main-nav a').reverse();
    mainNavLinks.forEach(link => {
        link.addEventListener('mouseleave', e => {
            link.classList.add('animate-out');
            setTimeout(() => {
                link.classList.remove('animate-out');
            }, 300)
        })
    })

    function navAnimation(direction) {
        const scrollingDown = direction === 1;
        // console.log(direction);
        const links = scrollingDown ? mainNavLinks : mainNavLinksRev;
        return gsap.to(links, {
            duration: 1,
            stagger: 0.5,
            autoAlpha: () => scrollingDown ? 0 : 1,
            y: () => scrollingDown ? 20 : 0,
            ease: 'power4.out'
        });
    }

    ScrollTrigger.create({
        trigger: '#main',
        start: 100,
        end: 'bottom bottom-=200',
        toggleClass: {
            targets: 'body',
            className: 'has-scrolled'
        },
        onEnter: ({direction}) => {
            navAnimation(direction)
        },
        onLeaveBack: ({direction}) => {
            navAnimation(direction)
        },
        // markers: true
    })
}

function initHeaderTilt() {
    document.querySelector('header')
        .addEventListener('mousemove', moveImages);
}

function moveImages(e) {
    const {offsetX, offsetY, target} = e;
    const {clientWidth, clientHeight} = target;
    console.log(offsetX, offsetY, clientWidth, clientHeight);

    // get 0 0 in the center
    const xPos = (offsetX / clientWidth) - 0.5;
    const yPos = (offsetY / clientHeight) - 0.5;

    const leftImages = gsap.utils.toArray('.hg__left .hg__image');
    const rightImages = gsap.utils.toArray('.hg__right .hg__image');

    const modifier = (index) => index * 1.2 + 0.5;

    leftImages.forEach((image, index) => {
        gsap.to(image, {
            duration: 1.2,
            x: xPos * 20 * modifier(index),
            y: yPos * 30 * modifier(index),
            rotationY: xPos * 40,
            rotationX: yPos * 10,
            ease: 'power3.out'
        });
    });
    rightImages.forEach((image, index) => {
        gsap.to(image, {
            duration: 1.2,
            x: xPos * 20 * modifier(index),
            y: -yPos * 30 * modifier(index),
            rotationY: xPos * 40,
            rotationX: yPos * 10,
            ease: 'power3.out'
        });
    });

    gsap.to('.decor__circle', {
        duration: 1.7,
        x: 100 * xPos,
        y: 120 * yPos,
        ease: 'power4.out'
    });

}

function initHoverReveal() {
    const sections = document.querySelectorAll('.rg__column');

    sections.forEach(section => {
        section.imageBlock = section.querySelector('.rg__image');
        section.image = section.querySelector('.rg__image img');
        section.mask = section.querySelector('.rg__image--mask');
        section.text = section.querySelector('.rg__text');
        section.textCopy = section.querySelector('.rg__text--copy');
        section.textMask = section.querySelector('.rg__text--mask');
        section.textP = section.querySelector('.rg__text--copy p');

        gsap.set([section.imageBlock, section.textMask], {yPercent: -101});
        gsap.set([section.mask, section.textP], {yPercent: 100});
        gsap.set(section.image, {scale: 1.2});

        section.addEventListener('mouseenter', createHoverReveal);
        section.addEventListener('mouseleave', createHoverReveal);
    })
}

const updateBodyColor = (color) => {
    gsap.to('.fill-background', {backgroundColor: color, ease: 'none'});
    //document.documentElement.style.setProperty('--bcg-fill-color', color);
}

function getTextHeight(textCopy) {
    return textCopy.clientHeight;

}

function resetProps(elements) {
    gsap.killTweensOf("*");
    if (elements && elements.length) {
        elements.forEach(el => {
            el && gsap.set(el, {clearProps: 'all'});
        })
    }
}

function createHoverReveal(e) {
    console.log(e.type);
    console.log(e.target);
    const {imageBlock, mask, text, textCopy, textMask, textP, image, dataset} = e.target;

    const {color} = dataset;

    const tl = gsap.timeline({
        defaults: {
            duration: 0.7,
            ease: 'Power4.out'
        }
    })
    if (e.type === 'mouseenter') {
        tl.to([mask, textMask, textP], {yPercent: 0})
            .to(imageBlock, {
                yPercent: 0,
                onStart: () => updateBodyColor(color)
            }, 0)
            .to(text, {y: -getTextHeight(textCopy) / 2}, 0)
            .to(image, {duration: 1.1, scale: 1}, 0);
    } else if (e.type === 'mouseleave') {
        tl.to([mask, textP], {yPercent: 100})
            .to([imageBlock, textMask], {yPercent: -101}, 0)
            .to(text, {y: 0}, 0)
            .to(image, {scale: 1.2}, 0);
    }
    return tl;
}

//portfolio
const allLinks = gsap.utils.toArray('.portfolio__categories a');
const pageBackground = select('.fill-background');
const largeImage = select('.portfolio__image--l');
const smallImage = select('.portfolio__image--s');
const lInside = select('.portfolio__image--l .image_inside');
const sInside = select('.portfolio__image--s .image_inside');

function initPortfolioHover() {
    allLinks.forEach(link => {
        link.addEventListener('mouseenter', createPortfolioHover);
        link.addEventListener('mouseleave', createPortfolioHover);
        link.addEventListener('mousemove', createPortfolioMove);
    });
}

function createPortfolioHover(e) {
    // console.log(e);
    if (e.type === 'mouseenter') {

        // change images to the right urls
        // fade in images
        // all siblings to white and fade out
        // active link to white
        // update page background color

        const {color, imagelarge, imagesmall} = e.target.dataset;
        const allSiblings = allLinks.filter(item => item !== e.target);
        const tl = gsap.timeline({
            onStart: () => updateBodyColor(color)
        });
        tl
            .set(lInside, {backgroundImage: `url(${imagelarge})`})
            .set(sInside, {backgroundImage: `url(${imagesmall})`})
            .to([largeImage, smallImage], {autoAlpha: 1})
            .to(allSiblings, {color: '#fff', autoAlpha: 0.2}, 0)
            .to(e.target, {color: '#fff', autoAlpha: 1}, 0);

    } else if (e.type === 'mouseleave') {

        // fade out images
        // all links back to black
        // change background color back to default

        const tl = gsap.timeline({
            onStart: () => updatePortfolioBodyColor('#ACB7AE')
        });
        tl
            .to([largeImage, smallImage], {autoAlpha: 0})
            .to(allLinks, {color: '#000000', autoAlpha: 1}, 0);

    }

}

function createPortfolioMove(e) {

    const {clientY} = e;

    // move large image
    gsap.to(largeImage, {
        duration: 1.2,
        y: getPortfolioOffset(clientY) / 6,
        ease: 'power3.out'
    });

    // move small image
    gsap.to(smallImage, {
        duration: 1.5,
        y: getPortfolioOffset(clientY) / 3,
        ease: 'power3.out'
    });

}

function getPortfolioOffset(clientY) {
    return -(select('.portfolio__categories').clientHeight - clientY);
}

const updatePortfolioBodyColor = (color) => {
    gsap.to(pageBackground, {backgroundColor: color, ease: 'none'});
}

function initImageParallax() {
    gsap.utils.toArray('.with-parallax').forEach(section => {
        const image = section.querySelector('img');
        gsap.to(image, {
            yPercent: 20,
            ease: 'none',
            scrollTrigger: {
                // trigger: image,
                trigger: section,
                start: 'top bottom',
                scrub: true,
                //  markers: true
            }

        })
    })
}

function initImageParallax() {
    gsap.utils.toArray('.with-parallax').forEach(section => {
        const image = section.querySelector('img');
        gsap.to(image, {
            yPercent: 20,
            ease: 'none',
            scrollTrigger: {
                // trigger: image,
                trigger: section,
                start: 'top bottom',
                scrub: true,
               // markers: true
            }

        })
    })
}

function initPinSteps() {
    ScrollTrigger.create({
        trigger: '.fixed-nav',
        start: 'top center',
        endTrigger: '#stage4',
        end: 'center center',
        pin: true,
        pinReparent: true,
      //  markers: true
    })
    const getVh = () => {
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        return vh;
    }
    gsap.utils.toArray('.stage').forEach((stage, index) => {
        const navLinks = gsap.utils.toArray('.fixed-nav li');

        ScrollTrigger.create({
            trigger: stage,
            start: 'top center',
            end: () => {
                return `+=${stage.clientHeight + getVh() / 10}`
            },
            // end: 'bottom center',
            toggleClass: {
                targets: navLinks[index],
                className: 'is-active'
            },
           // markers: true,
            onEnter: () => {
                updateBodyColor(stage.dataset.color);
            },
            onEnterBack: () => {
                updateBodyColor(stage.dataset.color);
            }

        })

    })
}

function initScrollTo() {
    gsap.utils.toArray('.fixed-nav a').forEach(link => {
        const target = link.getAttribute('href');
        link.addEventListener('click', (e) => {
            e.preventDefault();
            gsap.to(window, {duration: 1.5, scrollTo: target, ease: 'Power2.out'});
            bodyScrollBar.scrollIntoView(document.querySelector(target), {damping: 0.07, offsetTop: 100})
        })
    });
}

function initSmoothScrollbar() {
    bodyScrollBar = Scrollbar.init(document.querySelector('#viewport'), {damping: 0.07});

    bodyScrollBar.track.xAxis.element.remove();

    ScrollTrigger.scrollerProxy(document.body, {
        scrollTop(value) {
            if (arguments.length) {
                bodyScrollBar.scrollTop = value; // setter
            }
            return bodyScrollBar.scrollTop;    // getter
        }
    });
    bodyScrollBar.addListener(ScrollTrigger.update);
}
//loader
const loader = select('.loader');
const loaderInner = select('.loader .inner');
const progressBar = select('.loader .progress');

gsap.set(loader, {autoAlpha: 1});
gsap.set(loaderInner, {scaleY: 0.005, transformOrigin: 'bottom'});

const progressTween = gsap.to(progressBar, {pause: true, scaleX: 0, ease: 'none', transformOrigin: 'right'});

let loadedImageCount = 0, imageCount;
const container = select('#main');

const imgLoad = imagesLoaded(container);
imageCount = imgLoad.images.length;

UpdateProgress(0);

imgLoad.on('progress', function () {
    loadedImageCount++;
    UpdateProgress(loadedImageCount);
});

function UpdateProgress(value) {
    gsap.to(progressTween, {progress: value / imageCount, duration: 0.3, ease: 'power1.out'});
}

imgLoad.on('done', function (instance) {

    gsap.set(progressBar, {delay: 0.5, autoAlpha: 0, onComplete: initLoader});

});
function initLoader() {
    const loaderContent = select('.loader__content');
    const loaderImage = select('.loader__image img');
    const loaderMask = select('.loader__image--mask');
    const text1 = select('.loader__title--mask:nth-child(1) span');
    const text2 = select('.loader__title--mask:nth-child(2) span');

    const tlLoaderIn = gsap.timeline({
        id: 'tlLoaderIn',
        defaults: {
            duration: 1.1,
            ease: 'power2.out'
        },
        onComplete: () => select('body').classList.remove('is-loading')
    });

    tlLoaderIn
        .set(loaderContent, {autoAlpha: 1})
        .to(loaderInner, {
            scaleY: 1,
            transformOrigin: 'bottom',
            ease: 'power2.inOut'
        })
        .addLabel('revealImage')
        .from(loaderMask, {
            yPercent: 100
        }, 'revealImage-=0.6')
        .from(loaderImage, {
            yPercent: -80
        }, 'revealImage-=0.6')
        .from([text1, text2], {
            yPercent: 100,
            stagger: 0.1
        }, 'revealImage-=0.4');

    const tlLoaderOut = gsap.timeline({
        id: 'tlLoaderOut',
        defaults: {
            duration: 1.2,
            ease: 'power2.inOut'
        },
        delay: 1
    });

    tlLoaderOut
        .to([text1, text2], {
            yPercent: -500,
            stagger: 0.2
        }, 0)
        .to([loader, loaderContent], {
            yPercent: -100,
        }, 0.2)
        .from('#main', {
            y: 150
        }, 0.2);

    const tlLoader = gsap.timeline();
    tlLoader
        .add(tlLoaderIn)
        .add(tlLoaderOut)


    // GSDevTools.create({paused: true})
}

function init() {
    initSmoothScrollbar();
    initNavigation();
    initHeaderTilt();
    initPortfolioHover();
    handleWidthChange(mq);
    initImageParallax();
    initPinSteps();
    initScrollTo();
}

window.addEventListener('load', function () {
    init();
});
const mq = window.matchMedia("(min-width: 768px)");

function handleWidthChange(mq) {
    if (mq.matches) {
        //console.log('desktop');
        initHoverReveal();
    } else {
        // console.log('mobile');
        const sections = document.querySelectorAll('.rg__column');
        sections.forEach(section => {
            section.removeEventListener('mouseenter', createHoverReveal);
            section.removeEventListener('mouseleave', createHoverReveal);
            const {imageBlock, mask, text, textCopy, textMask, textP, image} = section;
            resetProps([imageBlock, mask, text, textCopy, textMask, textP, image]);

        })
    }
}

mq.addListener(handleWidthChange);
