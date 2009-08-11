/*
css skinnable select inputs.

Usage:
HTML:
<div>
  <select>
    <option>value 1</option>
    <option>value 2</option>
  </select>
  <div class="snazzy_selected">placeholder</div>
</div>

Javascript:
$('select').snazzySelect();

*/
(function($) {
	$.fn.snazzySelect = function(options) {
		return this.each(function() {
			new $.SnazzySelect(this, options);
		});
	};

	$.SnazzySelect = function (e, options) {
  	var defaults = {
  	  listClass: "snazzy_select",
  	  hoverClass: "snazzy_hover",
  	  selectionClass: "snazzy_selected",
  	  activeClass: 'snazzy_active',
  	  breakClass: "snazzy_break"
    };

    var options = $.extend({}, defaults, options);
  	
	  var select = $(e).hide();
	  var parentDiv = select.parent('div');
	  select.closest('form').bind('reset', resetForm);
	  var value = $("<span class='value' />").click(toggleDiv);
    var icon = $("<span class='icon'>&#9660;</span>").click(toggleDiv);
	  var selection = parentDiv.find('div.' + options.selectionClass).html('').append(value).append(icon);

	  var list = $("<ul></ul>").addClass(options.listClass).hide().appendTo($('body')).bind('positionList', positionList);
	  select.children("option").each(function(){
	    var option = $(this);
      var li = $("<li />").html(option.text()).appendTo(list).data('snazzy.option', option).attr('class', option.attr('class'));
      option.data('snazzy.element', li);
      li.hover(onHover);
      li.click(onClick);
	  });
	  if(options.extraElements){
  	  $("<li />").addClass(options.breakClass).appendTo(list);
	    options.extraElements.each(function(){
	      $("<li />").appendTo(list).append($(this));
	    });
	  }
	  
	  select.change(changeSelection);
	  changeSelection();

	  function hideIfSelectionNotClicked(e) {
	    var clicked = $(e.target);
	    //clicked.is(selection) doesn't work here
      if (clicked.html() != value.html() && clicked.html() != icon.html()) {
        hide();
      }
	  }
    function selectedOption() {
      return select.children("option:selected");
    }
    function resetForm() {
      setTimeout(changeSelection, 0);
    }
	  function changeSelection() {
	    hide();
  	  value.html(selectedOption().text());
	  }
  	function toggleDiv(e){
  	  if (list.is(":hidden")) {
  	    show();
  	  } else if (list.is(":visible")) {
  	    hide();
  	  }
  	}
  	function selectedElement() {
  	  return selectedOption().data('snazzy.element');
  	}
  	function show() {
  	  positionList();
	    hover(selectedElement());
	    selection.addClass(options.activeClass);
  	  list.show();
  	  $(document).keydown(keyPressed);
      $(document).click(hideIfSelectionNotClicked);
  	}
  	function hide() {
  	  list.hide();
  	  selection.removeClass(options.activeClass);
  	  $(document).unbind('keydown', keyPressed);
  	  $(document).unbind('click', hideIfSelectionNotClicked);
  	}
  	function keyPressed(e){
  	  if (!list.is(':visible')) {
  	    return;
  	  }
  	  switch(e.keyCode) {
  	    case $.SnazzySelect.KEYS.TAB:
  	    case $.SnazzySelect.KEYS.RETURN:
    	    e.preventDefault();
    	    selectElement(highlightedElement());
    	    return false;
  	    case $.SnazzySelect.KEYS.ESCAPE:
    	    e.preventDefault();
    	    hide();
    	    return false;
  	    case $.SnazzySelect.KEYS.UP:
    	    e.preventDefault();
    	    selectUp();
    	    return false;
  	    case $.SnazzySelect.KEYS.DOWN:
    	    e.preventDefault();
    	    selectDown();
    	    return false;
	    }
  	}
  	function highlightedElement() {
  	  return list.children("li." + options.hoverClass);
  	}
  	function selectUp(){
  	  var nextPotentialLi = highlightedElement().prev("li:not(." + options.breakClass + ')');
  	  if(nextPotentialLi.size() > 0){
  	    hover(nextPotentialLi);
	    }
  	}
  	function selectDown(){
  	  var nextPotentialLi = highlightedElement().next("li:not(." + options.breakClass + ')');
  	  if(nextPotentialLi.size() > 0){
  	    hover(nextPotentialLi);
  	  }
  	}
  	function selectElement(li){
      selectedOption().removeAttr("selected");
  	  var selection = li.data('snazzy.option');
      selection.attr("selected","selected");
      select.change();
  	}
  	function onClick(e){
      selectElement($(this));
  	}
  	function hover(li){
  	  removeHover();
  	  li.addClass(options.hoverClass);
  	}
  	function removeHover(){
  	  list.children("li").removeClass(options.hoverClass);
  	}
  	function onHover(e){
  	  var li = $(this);
	    hover(li);
  	}
  	function positionList(){
  	  list.css({
  	    "top": (selection.offset().top + selection.outerHeight()), 
  	    "left": selection.offset().left, 
  	    "position": "absolute",
  	    "z-index": 99999
  	  });
  	}
  }

  $.SnazzySelect.KEYS = {
		UP: 38,
		DOWN: 40,
		TAB: 9,
		RETURN: 13,
		ESCAPE: 27
	};

})(jQuery);
