(function($) {
	$.fn.snazzySelect = function(options) {
		return this.each(function() {
			new $.SnazzySelect(this, options);
		});
	};

	$.SnazzySelect = function (e, options) {
  	var defaults = {
  	  ulClass: "snazzy_select",
  	  hoverClass: "snazzy_hover",
  	  currentClass: "snazzy_current",
  	  selectedDivClass: "snazzy_selected",
  	  breakClass: "snazzy_break",
  	  extraElements: null,
    };

    var options = $.extend({}, defaults, options);
  	
	  var select = $(e).hide().change(changeSelection);
	  var parentDiv = select.parent('div');
	  select.closest('form').bind('reset', resetForm);
	  var list = $("<ul></ul>").addClass(options.ulClass).hide().appendTo($('body'));
	  var currentSelectedElement = select.children("option:selected");
	  var selectedDiv = parentDiv.find('div.' + options.selectedDivClass).text(currentSelectedElement.text()).click(toggleDiv);
    var dropdownIcon = $("<span>&#9660;</span>").appendTo(selectedDiv);

	  generateSnazzySelect();
	  $(document).keydown(keyPressed);

    function resetForm() {
      setTimeout(changeSelection, 0);
    }
	  function changeSelection() {
	    var selected = select.find("option:selected");
	    var li = selected.data('snazzy.element');
	    removeHover();
	    list.children('li').removeClass(options.currentClass);
  	  li.addClass(options.currentClass);
  	  selectedDiv.empty().html(selected.text()).append(dropdownIcon);
	    list.hide();
	  }
  	function generateSnazzySelect(){
  	  select.children("option").each(function(){
  	    var option = $(this);
	      var li = $("<li></li>").html(option.text()).appendTo(list).data('snazzy.option', option);
	      option.data('snazzy.element', li);
	      if(option.val() == currentSelectedElement.val()){
	        li.addClass(options.currentClass);
	      }
	      li.hover(onHover);
        li.click(liClick);
  	  });
  	  if(options.extraElements){
    	  $("<li></li>").addClass(options.breakClass).appendTo(list);
  	    options.extraElements.each(function(){
  	      var li = $("<li></li>").appendTo(list).append($(this));
  	    });
  	  }
  	}
  	function toggleDiv(e){
  	  if (list.is(":hidden")) {
  	    positionList();
  	    var current = list.children('li.' + options.currentClass);
  	    hover(current);
    	  list.show();
  	  } else if (list.is(":visible")) {
  	    list.hide();
  	  }
  	}
  	function keyPressed(e){
  	  if (!list.is(':visible')) {
  	    return;
  	  }
  	  switch(e.keyCode) {
  	    case $.SnazzySelect.KEYS.TAB:
  	    case $.SnazzySelect.KEYS.RETURN:
    	    e.preventDefault();
    	    selectLi(selectedElement());
    	    return false;
  	    case $.SnazzySelect.KEYS.ESC:
    	    e.preventDefault();
    	    list.hide();
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
  	function selectedElement() {
  	  return list.children("li." + options.hoverClass);
  	}
  	function selectUp(){
  	  var nextPotentialLi = selectedElement().prev("li:not(" + options.breakClass + ')');
  	  if(nextPotentialLi.size() > 0){
  	    hover(nextPotentialLi);
	    }
  	}
  	function selectDown(){
  	  var nextPotentialLi = selectedElement().next("li:not(" + options.breakClass + ')');
  	  if(nextPotentialLi.size() > 0){
  	    hover(nextPotentialLi);
  	  }
  	}
  	function selectLi(li){
      select.find("option:selected").removeAttr("selected");
  	  var selection = li.data('snazzy.option');
      selection.attr("selected","selected");
      select.change();
  	}
  	function liClick(e){
      selectLi($(this));
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
  	    "top": (selectedDiv.offset().top + selectedDiv.outerHeight()), 
  	    "left": selectedDiv.offset().left, 
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
		ESC: 27
	};

})(jQuery);