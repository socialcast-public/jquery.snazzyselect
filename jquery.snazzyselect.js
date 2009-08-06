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
  	  currentClass: "snazzy_current",
  	  selectionClass: "snazzy_selected",
  	  activeClass: 'snazzy_active',
  	  breakClass: "snazzy_break",
  	  extraElements: null,
    };

    var options = $.extend({}, defaults, options);
  	
	  var select = $(e).hide().change(changeSelection);
	  var parentDiv = select.parent('div');
	  select.closest('form').bind('reset', resetForm);
	  var list = $("<ul></ul>").addClass(options.listClass).hide().appendTo($('body')).bind('positionList', positionList);
	  var selection = parentDiv.find('div.' + options.selectionClass).text(selectedOption().text()).click(toggleDiv);
    var dropdownIcon = $("<span>&#9660;</span>").appendTo(selection);

	  generateSnazzySelect();
	  
	  function hideIfSelectionNotClicked(e) {
	    var clicked = $(e.target);
	    //clicked.is(selection) doesn't work here
      if (clicked.text() != selection.text()) {
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
	    var li = selectedOption().data('snazzy.element');
	    removeHover();
	    list.children('li').removeClass(options.currentClass);
  	  li.addClass(options.currentClass);
  	  selection.empty().html(selectedOption().text()).append(dropdownIcon);
	    hide();
	  }
  	function generateSnazzySelect(){
  	  select.children("option").each(function(){
  	    var option = $(this);
	      var li = $("<li></li>").html(option.text()).appendTo(list).data('snazzy.option', option);
	      option.data('snazzy.element', li);
	      if(option.val() == selectedOption().val()){
	        li.addClass(options.currentClass);
	      }
	      li.hover(onHover);
        li.click(onClick);
  	  });
  	  if(options.extraElements){
    	  $("<li />").addClass(options.breakClass).appendTo(list);
  	    options.extraElements.each(function(){
  	      $("<li />").appendTo(list).append($(this));
  	    });
  	  }
  	}
  	function toggleDiv(e){
  	  e.stopPropagation();
  	  if (list.is(":hidden")) {
  	    show();
  	  } else if (list.is(":visible")) {
  	    hide();
  	  }
  	}
  	function show() {
  	  positionList();
	    var current = list.children('li.' + options.currentClass);
	    hover(current);
	    selection.addClass(options.activeClass);
  	  list.show();
  	  $(document).keydown(keyPressed);
  	  $(document).click(hideIfSelectionNotClicked);
  	}
  	function hide() {
  	  selection.removeClass(options.activeClass);
  	  list.hide();
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
