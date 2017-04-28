var $ = require('jquery');

module.exports = function() {
    "use strict";
    var pluginName = "easyNumber",
        defaults = {
            plus: '+',
            minus: '-',
            readonly: true,
            allowNegative: false,
            dateFormat: 'DD-MM-YYYY',
            timeFormat: 'HH:mm',
            type: 'int',
            validation: false,
            zero: null
        };
    // The actual plugin constructor
    function Plugin(element, options) {
        this.element = element;
        this.$element = $(this.element).addClass('easyNumber__input');
        this.$parent = null;
        this.settings = $.extend({}, defaults, options);
        this.settings.min = this.$element.data('min') ? this.$element.data('min') : false;
        this.settings.max = this.$element.data('max') ? this.$element.data('max') : false;
        this.settings.incrementationValue = $(this.element).data('qty-for-change') ? $(this.element).data('qty-for-change') : 1;
        this.settings.floatEnable = $(this.element).data('qty-float-val') ? $(this.element).data('qty-float-val') : false;
        this.init();
    }
    Plugin.prototype = {
        init: function () {
            var that = this,
                fractionDigs;

            if (this.$element.is('input:text') || this.$element.is('input[type="number"]')) {
                this.prepareHtml();
                if(this.settings.zero !== null){
                    this.$element.val(this.settings.zero);
                }
                this.bindEvents();
            }
        },
        prepareHtml: function () {
            this.$element.wrap('<div class="easyNumber" />');
            this.$parent = this.$element.parent();
            this.$parent.append(' <a class="easyNumber__plus" href="#"><span class="icon icon--arrow--up"></span><span class="label">' + this.settings.plus + '</span></a> <a class="easyNumber__minus" href="#"><span class="icon icon--arrow--down"></span><span class="label">' + this.settings.minus + '</span></a>');
            if (this.settings.readonly) {
                this.$element.prop('readonly', true);
            }
        },
        bindEvents: function () {
            var that = this;
            this.$parent.find('.easyNumber__plus').on('click', function (e) {
                e.preventDefault();
                that.update(true);
            });
            this.$parent.find('.easyNumber__minus').on('click', function (e) {
                e.preventDefault();
                that.update(false);
            });
            this.$parent.find('input').on('blur', function (e) {
                that.enteredValue();
            });
            if (this.settings.validation) {
                if (this.settings.validation === 'numbers') {
                    this.$element.on('keypress', function (e) {
                        return (e.charCode > 47 && e.charCode < 58) || e.charCode == 44 || e.charCode == 46;
                    });
                }
            }
        },
        update: function (increment) {
            if (this.settings.type === 'day') {
                this.updateDay(increment);
            } else if (this.settings.type === 'time') {
                this.updateTime(increment);
            } else {
                this.updateInt(increment);
            }
        },
        countDecimals: function (value) {
            return value % 1?value.toString().split('.')[1].length:0;
        },
        updateInt: function (increment) {
            var currentValue,
                newValue,
                qtyValue,
                fractionDigs,
                newValueFormatted = false;

            if (this.settings.floatEnable) {
                currentValue = (this.$element.val() === this.settings.zero || !this.$element.val().length) ? 0 : parseFloat(this.$element.val().replace(',', '.')),
                fractionDigs = this.countDecimals(currentValue);

                newValue = increment ? (currentValue + 1) : (currentValue - 1),
                newValue = newValue.toFixed(fractionDigs);
                newValueFormatted = false;
            } else {
                currentValue = (this.$element.val() === this.settings.zero || !this.$element.val().length) ? 0 : parseInt(this.$element.val(), 10),
                newValue = increment ? (currentValue + this.settings.incrementationValue) : (currentValue - this.settings.incrementationValue),
                newValueFormatted = false;
                newValue = parseInt(newValue, 10);
            }
            if (!this.settings.allowNegative && newValue < 1) {
                newValue = 0;
            }
            if (newValue === 0 && this.settings.zero) {
                newValueFormatted = this.settings.zero;
            }
            if (this.settings.max && newValue > this.settings.max || this.settings.min && newValue < this.settings.min) {

            } else {
                this.$element.val(newValueFormatted ? newValueFormatted : newValue);
            }
        },
        enteredValue: function () {
            var qtyValue,
                newValue,
                currentValue = this.$element.val().replace(',', '.') || 0,
                $productMsg = $(this.element).closest($('.field--number')).find('.std-msg');

            if (this.settings.floatEnable) {
                return;
            }

            if ((currentValue % this.settings.incrementationValue > 1) || (this.settings.incrementationValue == 1 && (currentValue % 1 !== 0))) {
                if (currentValue < this.settings.incrementationValue) {
                // round to the nearest qty in packag
                    qtyValue = this.settings.incrementationValue;
                } else {
                    qtyValue = Math.ceil(currentValue / this.settings.incrementationValue) * this.settings.incrementationValue;
                }
                $productMsg.show();
            } else if (((currentValue % this.settings.incrementationValue) > 0) && ((currentValue % this.settings.incrementationValue) < 1)) {
                currentValue = parseInt(currentValue, 10);
                qtyValue = currentValue + this.settings.incrementationValue
                $productMsg.show();
            } else {
                qtyValue = currentValue;
            }
            qtyValue = parseInt(qtyValue, 10);
            newValue = qtyValue.toString();
            this.$element.val(newValue);
            setTimeout(function (){
                $productMsg.fadeOut();
            }, 2000);

        },
        updateDay: function (increment) {
            var currentValue = this.$element.val(),
                newValue = '';
            if ((this.settings.min === currentValue && !increment) || (this.settings.max === currentValue && increment)) {
            } else {
                newValue = increment ? moment(currentValue, this.settings.dateFormat).add(1, 'day').format(this.settings.dateFormat) : moment(currentValue, this.settings.dateFormat).subtract(1, 'day').format(this.settings.dateFormat)
                this.$element.val(newValue);
                this.$element.attr('value', newValue);
                this.$element.trigger('change', true);
            }
        },
        updateTime: function (increment) {
            var currentValue = this.$element.val(),
                newValue = '00:00';
            newValue = increment ? moment(currentValue, this.settings.timeFormat).add('1', 'minutes').format(this.settings.timeFormat) : moment(currentValue, this.settings.timeFormat).subtract('1', 'minutes').format(this.settings.timeFormat);
            this.$element.val(newValue).attr('value', newValue).trigger('change');
        }
    };
    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (this.name === 'e_qty') {
                $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
            }
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
            }
        });
    };
}($);