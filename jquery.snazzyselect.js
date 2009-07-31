(function($) {
	$.fn.snazzySelect = function(options) {
		return this.each(function() {
			new $.SnazzySelect(this, options);
		});
	};
	
	$.SnazzySelect = function (e, options) {
	  var KEYS = {
  		UP: 38,
  		DOWN: 40,
  		TAB: 9,
  		RETURN: 13,
  		ESC: 27
  	};
  	var defaults = {
  	  ulClass: "snazzy_select",
  	  hoverClass: "snazzy_hover",
  	  currentClass: "snazzy_current",
  	  selectedDivClass: "snazzy_selected",
  	  breakClass: "snazzy_break",
  	  extraElements: null,
  	  afterSelect: function(){},
    };

    var options = $.extend({}, defaults, options);
  	
	  var select = $(e).hide().change(changeSelection);
	  var parentDiv = select.parent('div');
	  var ul = $("<ul></ul>").addClass(options.ulClass).hide().appendTo($('body'));
	  var currentSelectedElement = select.children("option:selected");
	  var selectedDiv = parentDiv.find('div.' + options.selectedDivClass).text(currentSelectedElement.text()).click(toggleDiv);
    var dropdownIcon = $("<span>&#9660;</span>").appendTo(selectedDiv);

	  generateSnazzySelect();
	  $(document).keydown(keyPressed);

	  function changeSelection() {
	    var selected = select.find("option:selected");
	    var li = selected.data('snazzy.element');
	    ul.children('li').removeClass(options.currentClass).removeClass(options.hoverClass);
  	  li.addClass(options.hoverClass).addClass(options.currentClass);
  	  selectedDiv.empty().html(selected.text()).append(dropdownIcon);
	    options.afterSelect();
	    ul.hide();
	  }
  	function generateSnazzySelect(){
  	  select.children("option").each(function(){
  	    var option = $(this);
	      var li = $("<li></li>").html(option.text()).appendTo(ul).data('snazzy.option', option);
	      option.data('snazzy.element', li);
	      if(option.val() == currentSelectedElement.val()){
	        li.addClass(options.hoverClass).addClass(options.currentClass);
	      }
	      li.hover(onHover, outHover);
        li.click(liClick);
  	  });
  	  if(options.extraElements){
  	    addSpacer();
  	    options.extraElements.each(function(){
  	      var li = $("<li></li>").appendTo(ul).append($(this));
  	    });
  	  }
  	}
  	function toggleDiv(e){
  	  if (ul.is(":hidden")) {
  	    positionUl();
    	  ul.show();
  	  } else if (ul.is(":visible")) {
  	    ul.hide();
  	  }
  	}
  	function keyPressed(e){
  	  if (!ul.is(':visible')) {
  	    return;
  	  }
  	  switch(e.keyCode) {
  	    case KEYS.TAB:
  	    case KEYS.RETURN:
    	    e.preventDefault();
    	    var selected = ul.children("li." + options.hoverClass);
    	    selectLi(selected);
    	    return false;
  	    case KEYS.ESC:
    	    e.preventDefault();
    	    ul.hide();
    	    return false;
  	    case KEYS.UP:
    	    e.preventDefault();
    	    selectUp();
    	    return false;
  	    case KEYS.DOWN:
    	    e.preventDefault();
    	    selectDown();
    	    return false;
	    }
  	}
  	function selectUp(){
  	  var currentlySelectedLi = ul.children("li."+ options.hoverClass);
  	  var nextPotentialLi = currentlySelectedLi.prev("li:not(" + options.breakClass + ')');
  	  if(nextPotentialLi.size() > 0){
  	    addHover(nextPotentialLi);
	    }
  	}
  	function selectDown(){
  	  var currentlySelectedLi = ul.children("li."+ options.hoverClass);
  	  var nextPotentialLi = currentlySelectedLi.next("li:not(" + options.breakClass + ')');
  	  if(nextPotentialLi.size() > 0){
  	    addHover(nextPotentialLi);
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
  	function addHover(li){
  	  removeHover();
  	  li.addClass(options.hoverClass);
  	}
  	function removeHover(){
  	  ul.children("li").removeClass(options.hoverClass);
  	}
  	function onHover(e){
  	  var li = $(this);
	    addHover(li);
  	}
  	function outHover(e){
  	  removeHover();
  	}
  	function positionUl(){
  	  ul.css({
  	    "top": (selectedDiv.offset().top + selectedDiv.outerHeight()), 
  	    "left": selectedDiv.offset().left, 
  	    "position": "absolute",
  	    "z-index": 99999
  	  });
  	}
  	function addSpacer(){
  	  var li = $("<li></li>").addClass(options.breakClass).appendTo(ul);
  	}
  }
})(jQuery);