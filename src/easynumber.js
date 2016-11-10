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
        this.element        =   element;
        this.$element       =   $(this.element).addClass('easyNumber__input');
        this.$parent        =   null;
        this.settings       =   $.extend({}, defaults, options);
        this.settings.min   = this.$element.data('min') ? this.$element.data('min') : false;
        this.settings.max   = this.$element.data('max') ? this.$element.data('max') : false;
        this.init();
    }
    Plugin.prototype = {
        init: function () {
            var that = this;
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
            this.$parent.append(' <a class="easyNumber__plus" href="#">' + this.settings.plus + '</a> <a class="easyNumber__minus" href="#">' + this.settings.minus + '</a>');
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
            if (this.settings.validation) {
                if (this.settings.validation === 'numbers') {
                    this.$element.on('keypress', function (e) {
                        return e.charCode > 47 && e.charCode < 58;
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
        updateInt: function (increment) {
            var currentValue = (this.$element.val() === this.settings.zero || !this.$element.val().length) ? 0 : parseInt(this.$element.val(), 10),
                newValue = increment ? (currentValue + 1) : (currentValue - 1),
                newValueFormatted = false;
            newValue = parseInt(newValue, 10);
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
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            }
        });
    };
}($);