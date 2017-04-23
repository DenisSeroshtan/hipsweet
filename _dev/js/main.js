//________________________/preloader/______________________//
window.onload = function() {
    document.querySelector('.wrapper').classList.add('loaded');
};

$(document).ready(function() {
    //________________________/slider/______________________//
    $('.slider__list').bxSlider({
        auto: true,
        autoDelay: 5000,
        speed: 1500,
        pause: 5000

    });
    //________________________/fancybox/______________________//
    $("a.deliver__item-link").fancybox({
        speedIn: 3000,
        speedOut: 3000
    });
    //________________________/akkordeon/______________________//
    $(function() {

        $('.questions__item').on('click', function(e) {
            e.preventDefault();

            var
                $this = $(this),
                duration = 600,
                item = $this.closest('.questions__item'),
                currentContent = item.find('.questions__item-text');
            if (!item.hasClass('active')) {
                item.addClass('active')
                    .siblings()
                    .removeClass('active')
                    .find('.questions__item-text')
                    .slideUp(duration);
                currentContent.stop(true, true).slideDown(duration);
            } else {
                item.removeClass('active');
                currentContent.stop(true, true).slideUp(duration);
            }
        });
    }());
    //________________________/phone mask/______________________//
    $(function() {

        $('.tel').mask('8(999) 999-99-99');
    }());

    //________________________/tab/______________________//
    $(function() {
        var flag = true;
        $('.team__item-link').on('click', function(e) {
            e.preventDefault();
            var $this = $(this),
                item = $this.closest('.team__item'),
                container = $this.closest('.tabs'),
                ndx = item.index(),
                content = container.find('.team__tabs');
            // variables animate 
            var activeItem = content.filter('.active'),
                reqItem = content.eq(ndx),
                duration = 500;
            if (flag) {
                flag = false;

                item.addClass('active')
                    .siblings()
                    .removeClass('active');

                activeItem.fadeOut(duration, function() {
                    reqItem.fadeIn(duration, function() {
                        reqItem.addClass('active')
                            .siblings()
                            .removeClass('active');
                        flag = true;
                    });
                });
            }
        });
    }());
    //________________________/scroll/______________________//
    $(function() {
        $('a[href^="#js"]').on('click', function(e) {
            e.preventDefault();
            var target = $(this).attr('href');
            $('html, body').animate({
                scrollTop: $(target).offset().top
            }, 1500);
        });
    }());

    //________________________/yandex map/______________________//
    (function() {

        ymaps.ready(init);

        function init() {
            var myMap = new ymaps.Map("map", {
                center: [55.75931658, 37.60628500],
                zoom: 15,
                controls: ["zoomControl"]
            });
            myPlacemark = new ymaps.Placemark([55.75931658, 37.60628500], {
                hintContent: 'Hipsweet',
                balloonContent: 'г. Москва, Вознесенский переулок 44 оф. 166'
            }, {
                iconLayout: 'default#image',
                iconImageHref: '/png/map/metka.png',
                iconImageSize: [42, 59],
                iconImageOffset: [-20, -60]
            });

            myMap.behaviors.disable(['scrollZoom']);

            myMap.geoObjects.add(myPlacemark);
        }
    }());

});