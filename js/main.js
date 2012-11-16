$(document).ready(function () {
    function init() {
        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = (function () {
                return window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function ( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
                    window.setTimeout(callback, 1000 / 60);
                };
            })();
        }
        var innerDiv = $("#lifespan-inner")[0];
        var canvas = $("#lifespan-canvas")[0];
        var canvasTop = $("#lifespan-canvas-top")[0];
        var span = $("#lifespan-span")[0];
        var context = canvas.getContext("2d");
        var wrapper = $("#wrapper")[0];
        var footer = $("#footer")[0];
        var start = $("#start")[0];
        var birthdateInput = $("#birthdate")[0];
        var copyright = $("#lifespan-span")[0];
        var contextTop = canvasTop.getContext("2d");


        MaskedInput({
            elm: birthdateInput,
            format: 'mm/dd/yyyy',
            separator: '\/',
            typeon: 'mdy'
        });

        var birthdate = new Date(1932, 01, 01);
        var maxYears = 80;
        var maxHours = maxYears * 365 * 24;

        var elapsedDate = new Date(Date.now() - birthdate);
        var elapsedHours = elapsedDate / 1000 / 60 / 60;
        var elapsedMinutes = elapsedHours * 60;


        var lastHour = elapsedHours >> 0;

        function setupDate() {
            elapsedDate = new Date(Date.now() - birthdate);
            elapsedHours = elapsedDate / 1000 / 60 / 60;
            elapsedMinutes = elapsedHours * 60;


            lastHour = elapsedHours >> 0;
        };

        /*var timer;
        $(document).mousemove(function () {
            if (timer) {
                clearTimeout(timer);
                timer = 0;
            }
            if (description.style.opacity == 0) {
                $('#description').fadeTo(100, 1);
                $('#title').fadeTo(100, 1);
            }
            timer = setTimeout(function () {
                $('#description').fadeTo(2000, 0);
                $('#title').fadeTo(2000, 0.5);
            }, 5000)
        })*/

        birthdateInput.onkeypress = _.bind(function () {
            function checkdate(input) {
                var validformat = /^\d{2}\/\d{2}\/\d{4}$/ //Basic check for format validity
                var returnval = false
                if (!validformat.test(input))
                    console.log("Invalid Date Format. Please correct and submit again.")
                else { //Detailed check for valid date ranges
                    var monthfield = input.split("/")[0]
                    var dayfield = input.split("/")[1]
                    var yearfield = input.split("/")[2]
                    var dayobj = new Date(yearfield, monthfield - 1, dayfield)
                    if ((dayobj.getMonth() + 1 != monthfield) || (dayobj.getDate() != dayfield) || (dayobj.getFullYear() != yearfield))
                        console.log("Invalid Day, Month, or Year range detected. Please correct and submit again.")
                    else
                        returnval = dayobj
                }
                return returnval
            }

            var newBirthdate = checkdate(birthdateInput.value);
            if (!newBirthdate)
                return;
            $("#lifespan-canvas-top").fadeOut("slow");
            $("#start").fadeOut("slow", _.bind(function() {
                birthdate = newBirthdate;
                update();
                $("#lifespan-canvas-top").fadeIn("slow");
            }, this));
        }, this);

        var imgd;
        var pix;

        var imgdTop;
        var pixTop;

        function layout() {

            //aspectRatio = $(window).width() / $(window).height();

            /*if (aspectRatio > 1.6) {
                canvas.height = Math.sqrt(maxHours / aspectRatio) >> 0;
                canvas.width = aspectRatio * canvas.height;
            } else {*/

            canvas.width = Math.min($(window).width() - 60, 1302) >> 0;
            canvas.height = maxHours / canvas.width >> 0;
            canvasTop.height = canvas.height;
            canvasTop.width = canvas.width;

            start.style.height = canvas.height + "px";
            start.style.width = canvas.width + "px";

            innerDiv.style.width = canvas.width + "px";
            innerDiv.style.height = canvas.height + "px";

            footer.style.top = (wrapper.clientHeight + 20) + "px";

            imgd = context.createImageData(canvas.width, canvas.height);
            pix = imgd.data;

            imgdTop = contextTop.createImageData(canvas.width, canvas.height);
            pixTop = imgdTop.data;
            wrapper.className = wrapper.className
        }


        window.Clock = {};
        Clock.canvas = canvas;
        Clock.canvasTop = canvasTop;
        Clock.span = span;
        Clock.context = context;
        Clock.contextTop = contextTop;
        Clock.birthdate = birthdate;
        Clock.maxYears = maxYears;
        Clock.maxHours = maxHours;
        Clock.elapsedDate = elapsedDate;
        Clock.elapsedHours = elapsedHours;
        Clock.elapsedMinutes = elapsedMinutes;
        Clock.imgd = imgd;
        Clock.pix = pix;
        Clock.imgdTop = imgdTop;
        Clock.pixTop = pixTop;


        var rainbow =
[[0, 67, 88],
[31, 138, 112],
[190, 219, 57],
[225, 225, 26],
[253, 116, 0]]
        function drawBase() {
            elapsedDate = new Date(Date.now() - birthdate);
            elapsedHours = elapsedDate / 1000 / 60 / 60;
            var curHourRatio = elapsedHours % 1;
            var curHourPixels = curHourRatio * elapsedHours;

            var dayCounter = 0;
            var yearCounter = 0;
            var floor = Math.floor;
            var rand = Math.random;
            var randNum = floor(Math.random() * 5);
            for (var i = 0, max = elapsedHours >> 0; i < max; i++) {
                var rI = i * 4;
                var gI = i * 4 + 1
                var bI = i * 4 + 2;
                var aI = i * 4 + 3;
                /*var randRainbow = rainbow[(rand() * 5) >> 0 % 4];
                pix[rI] = randRainbow[0];
                pix[gI] = randRainbow[1];
                pix[bI] = randRainbow[2];
                pix[aI] = 255; // alpha channel
                */
                var greyscale = (rand() * 50 + 220);
                pix[rI] = greyscale;
                pix[gI] = greyscale;
                pix[bI] = greyscale;
                pix[aI] = 255; // alpha channel
            }
            //stackBlurCanvasRGB(imgd, context, 0, 0, canvas.width, canvas.height, 1);
            for (var i = elapsedHours >> 0, max = maxHours; i < max; i++) {
                var rI = i * 4;
                var gI = i * 4 + 1
                var bI = i * 4 + 2;
                var aI = i * 4 + 3;
                var greyscale = (rand() * 50 + 100);
                pix[rI] = greyscale;
                pix[gI] = greyscale;
                pix[bI] = greyscale;
                pix[aI] = 255; // alpha channel
            }

            context.putImageData(imgd, 0, 0);
        };

        function colorLerp(color1, color2, factor) {
            var antifactor = 1 - (factor || 0.01);
            return [color1[0] * antifactor + color2[0] * factor,
                color1[1] * antifactor + color2[1] * factor,
                color1[2] * antifactor + color2[2] * factor]
        };

        function update() {
            window.requestAnimationFrame(update);
            imgdTop = contextTop.createImageData(canvas.width, canvas.height);
            pixTop = imgdTop.data;
            //contextTop.clearRect(0, 0, canvas.width, canvas.height);

            elapsedDate = new Date(Date.now() - birthdate);
            elapsedHours = elapsedDate / 1000 / 60 / 60;
            var curHourRatio = elapsedHours % 1;
            var curHourPixels = curHourRatio * elapsedHours;

            var curSecondsDigit = elapsedDate / 1000 % 60;
            var curSecondRatio = curSecondsDigit % 1;

            var targetPixel = (curHourPixels) >> 0;

            var pixPerColor = 200;
            for (var i = 0, max = canvas.width * 0.5 >> 0; i < max; i++) {
                var curPixel = -max + 1 + i + targetPixel;

                var x = (curPixel / pixPerColor >> 0);
                var color1 = rainbow[ x % rainbow.length]
                var color2 = rainbow[(x + 1) % rainbow.length]
                var lerpFactor = curPixel % pixPerColor / pixPerColor;
                console.log(lerpFactor + "");
                var lineColor = colorLerp(color1, color2, lerpFactor);//0, 100, 255

                var pixelIndex = curPixel * 4;
                pixTop[pixelIndex + 0] = lineColor[0];
                pixTop[pixelIndex + 1] = lineColor[1];
                pixTop[pixelIndex + 2] = lineColor[2];
                pixTop[pixelIndex + 3] = (i * i) / (max * max) * 255;
            }

            for (var i = 0, max = 2; i < max; i++) {
                var heightOffset = 0;
                if (i === 0)
                    heightOffset = 1;
                if (i === 1)
                    heightOffset = -1;

                var curPixel = targetPixel - 1 + canvas.width * heightOffset;
                var pixelIndex = curPixel * 4;

                pixTop[pixelIndex + 0] = lineColor[0];
                pixTop[pixelIndex + 1] = lineColor[1];
                pixTop[pixelIndex + 2] = lineColor[2];
                pixTop[pixelIndex + 3] = 100;
            }


            contextTop.putImageData(imgdTop, 0, 0);
            //requestAnimationFrame(update);
            if (lastHour !== elapsedHours >> 0) {
                lastHour = elapsedHours >> 0;
                drawBase();
            }
        }

        function resized() {
            layout();
            drawBase();
            update();
        }

        var resizeTimeout;
        $(window).resize(function () {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function () { resized(); }, 200);
        });

        layout();
        drawBase();
        update();
    }


    init();
});