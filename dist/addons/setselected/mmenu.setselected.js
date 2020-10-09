import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
import options from './_options';
import { extendShorthandOptions } from './_options';
import * as DOM from '../../_modules/dom';
import { extend } from '../../_modules/helpers';
//	Add the options.
Mmenu.options.setSelected = options;
export default function () {
    var _this = this;
    var options = extendShorthandOptions(this.opts.setSelected);
    this.opts.setSelected = extend(options, Mmenu.options.setSelected);
    //	Find current by URL
    if (options.current == 'detect') {
        var findCurrent_1 = function (url) {
            url = url.split('?')[0].split('#')[0];
            var anchor = _this.node.menu.querySelector('a[href="' + url + '"], a[href="' + url + '/"]');
            if (anchor) {
                _this.setSelected(anchor.parentElement);
            }
            else {
                var arr = url.split('/').slice(0, -1);
                if (arr.length) {
                    findCurrent_1(arr.join('/'));
                }
            }
        };
        this.bind('initMenu:after', function () {
            findCurrent_1.call(_this, window.location.href);
        });
        //	Remove current selected item
    }
    else if (!options.current) {
        this.bind('initListview:after', function (listview) {
            DOM.children(listview, '.mm-listitem--selected').forEach(function (listitem) {
                listitem.classList.remove('mm-listitem--selected');
            });
        });
    }
    //	Add :hover effect on items
    if (options.hover) {
        this.bind('initMenu:after', function () {
            _this.node.menu.classList.add('mm-menu--selected-hover');
        });
    }
    //	Set parent item selected for submenus
    if (options.parent) {
        this.bind('openPanel:after', function (panel) {
            //	Remove all
            DOM.find(_this.node.pnls, '.mm-listitem--selected-parent').forEach(function (listitem) {
                listitem.classList.remove('mm-listitem--selected-parent');
            });
            //	Move up the DOM tree
            var parent = DOM.find(_this.node.menu, "#" + panel.dataset.mmParent)[0];
            while (parent) {
                if (!parent.matches('.mm-listitem--vertical')) {
                    parent.classList.add('mm-listitem--selected-parent');
                }
                parent = parent.closest('.mm-panel');
                parent = DOM.find(_this.node.menu, "#" + parent.dataset.mmParent)[0];
            }
        });
        this.bind('initMenu:after', function () {
            _this.node.menu.classList.add('mm-menu--selected-parent');
        });
    }
}
