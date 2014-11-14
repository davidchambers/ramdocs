$(function () {

    function _init() {
        var $search = $('#search');

        $search.attr('autocomplete', 'off');
        $search.focus();
        $search.on('keydown', _searchKeydown);
        $search.on('keyup change input', _searchInput);
        $('.navigation').on('click', '.title', _navTitleClick);
        $(window).on('resize', _onResize);

        _filterSearchItems();
        _onResize();
        _loadDisqus();
    }

    function _searchKeydown(e) {
        switch (e.which) {
            // up
            case (38):
                _moveSelected(-1);
                return false;
            // down
            case (40):
                _moveSelected(1);
                return false;
            // enter
            case (13):
                _activateSelected();
                return false;
        }
    }

    function _searchInput() {
        _filterSearchItems();
        _initSelected();
    }

    var SELECTED_CLASSES = 'selected bg-primary';

    function _reveal($el, $target) {
        if ($el.is($target) || $el.is('body')) {
            return;
        }
        $el.show();
        _reveal($el.parent(), $target);
    }

    function _getActiveItems() {
        return $('.navigation .tab-pane.active ul.itemMembers .fn:visible');
    }

    function _getSelected() {
        return _getActiveItems().filter('.selected');
    }

    function _initSelected() {
        var $selected = _getSelected();

        if ($selected.length === 0) {
            _clearHiddenSelected();
            _getActiveItems().eq(0).addClass(SELECTED_CLASSES);
        }
    }

    function _clearHiddenSelected() {
        $('.navigation .tab-pane.active ul.itemMembers .selected').removeClass(SELECTED_CLASSES);
    }

    function _moveSelected(dir) {
        var $selected = _getSelected();
        if ($selected.length === 0) {
            _getActiveItems().eq(0).addClass(SELECTED_CLASSES);
        }
        else {
            var prev_next = (dir === -1) ? 'prevAll' : 'nextAll';
            var $sibling = $selected[prev_next]('.fn:visible');
            var $nextSelected = false;
            if ($sibling.length > 0) {
                $nextSelected = $($sibling.get(0));
            }
            else {
                var $parentSibling = $selected.parent().closest('li')[prev_next](':visible');
                if ($parentSibling.length > 0) {
                    var $cousin = $parentSibling.find('.fn:visible')[(dir === -1) ? 'last' : 'first']();
                    if ($cousin.length === 1) {
                        $nextSelected = $cousin;
                    }
                }
            }
            if ($nextSelected) {
                $selected.removeClass(SELECTED_CLASSES);
                $nextSelected.addClass(SELECTED_CLASSES);
            }
        }
    }

    function _activateSelected() {
        _getSelected().find('a').get(0).click();
    }

    function _filterSearchItems() {
        var value = $('#search').val();
        var $el = $('.navigation');

        if (value) {
            var regexp = new RegExp(value, 'i');
            var $tabContent = $el.find('.tab-content');
            $tabContent.find('li, .item, .itemMembers').hide();
            $el.find('li').each(function (i, v) {
                var $item = $(v);

                if ($item.data('name') && regexp.test($item.data('name'))) {
                    _reveal($item, $item.closest('.tab-pane'));
                }
            });
        } else {
            $el.find('li, .item, .itemMembers').show();
        }

        $el.find('.list').scrollTop(0);
    }

    function _navTitleClick(e) {
        $(this).parent().find('ul').toggle();
    };

    // Auto resizing on navigation
    function _onResize() {
        var height = $(window).height();
        var $el = $('.navigation');

        $el.height(height).find('.list').height(height - 133);
    };

    function _loadDisqus() {
        // disqus code
        if (config.disqus) {
            $(window).on('load', function () {
                var disqus_shortname = config.disqus; // required: replace example with your forum shortname
                var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
                dsq.src = 'http://' + disqus_shortname + '.disqus.com/embed.js';
                (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
                var s = document.createElement('script'); s.async = true;
                s.type = 'text/javascript';
                s.src = 'http://' + disqus_shortname + '.disqus.com/count.js';
                document.getElementsByTagName('BODY')[0].appendChild(s);
            });
        }
    }

    _init();
});
