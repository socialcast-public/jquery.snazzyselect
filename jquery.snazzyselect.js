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
  	  breakClass: "break",
  	  postElements: null,
  	  seperatePrompt: false,
  	  afterSelect: function(){},
    };

    var options = $.extend({}, defaults, options);
  	
	  var element = e;
	  var select = $(element).hide();
	  var parentDiv = select.parent('div');
	  var ul = $("<ul></ul>").addClass(options.ulClass).hide().appendTo($('body'));
	  var currentSelectedElement = select.children("option:selected");
	  var selectedDiv = parentDiv.find('div.' + options.selectedDivClass).text(currentSelectedElement.text()).click(toggleDiv);
	  var selectForm = select.closest("form");
    var dropdownIcon = $("<span>&#9660;</span>").appendTo(selectedDiv);

	  generateSnazzySelect();
	  $(document).keydown(keyPressed);
	  
	  selectForm.bind('reset', function(e) {
	    setTimeout(resetSelect, 1);
	  });
	  function resetSelect(){
	    select.val(select.find("option:contains('" + selectedDiv.html().replace(/<.+>$/,"") + "')").val());
	  }
	  
  	function generateSnazzySelect(){
  	  select.children("option").each(function(){
  	    var option = $(this);
	      var li = $("<li></li>").html(option.text()).appendTo(ul).data('snazzy.selection', option);
	      if(option.val() == currentSelectedElement.val()){
	        li.addClass(options.hoverClass).addClass(options.currentClass);
	      }
	      li.mouseover(onHover);
        li.mouseout(outHover);
        li.click(liClick);
	      if(options.seperatePrompt && option.val() == ""){
	        addSpacer();
	      }
  	  });
  	  if(options.postElements){
  	    addSpacer();
  	    options.postElements.each(function(){
  	      var li = $("<li></li>").appendTo(ul).append($(this));
  	      li.mouseover(onHover);
          li.mouseout(outHover);
          li.click(liClick);
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
  	  switch(e.keyCode) {
  	    case KEYS.TAB:
  	    options.afterSelect()
  	    case KEYS.RETURN:
  	    if(ul.is(":visible")){
    	    e.preventDefault();
    	    var enteredLi = ul.children("li." + options.hoverClass);
    	    if(enteredLi.children("a").size() == 0){
    	      selectLi(enteredLi);
    	    } else {
            window.location = enteredLi.children("a").attr("href");
    	    }
    	    ul.hide();
    	    options.afterSelect();
    	    return false;
  	    }
  	    case KEYS.ESC:
  	    if(ul.is(":visible")){
    	    e.preventDefault();
    	    ul.hide();
    	    options.afterSelect();
    	    return false;
  	    }
  	    case KEYS.UP:
  	    if(ul.is(":visible")){
    	    e.preventDefault();
    	    selectUp(e);
    	    return false;
  	    }
  	    case KEYS.DOWN:
  	    if(ul.is(":visible")){
    	    e.preventDefault();
    	    selectDown(e);
    	    return false;
  	    }
	    }
  	}
  	function selectUp(e){
  	  var currentlySelectedLi = ul.children("li."+ options.hoverClass);
  	  var nextPotentialLi = currentlySelectedLi.prev("li");
  	  if(nextPotentialLi.hasClass(options.breakClass)){
  	    nextPotentialLi = nextPotentialLi.prev("li");
  	  }
  	  if(nextPotentialLi.size() > 0){
  	    addHover(nextPotentialLi);
	    }
  	}
  	function selectDown(e){
  	  var currentlySelectedLi = ul.children("li."+ options.hoverClass);
  	  var nextPotentialLi = currentlySelectedLi.next("li");
  	  if(nextPotentialLi.hasClass(options.breakClass)){
  	    nextPotentialLi = nextPotentialLi.next("li");
  	  }
  	  if(nextPotentialLi.size() > 0){
  	    addHover(nextPotentialLi);
  	  }
  	}
  	function selectLi(li){
  	  ul.children('li').removeClass(options.currentClass).removeClass(options.hoverClass);
  	  li.addClass(options.hoverClass).addClass(options.currentClass);
  	  var selection = li.data('snazzy.selection');
  	  select.val(selection.val());
  	  selectedDiv.empty().html(selection.text()).append(dropdownIcon);
      select.trigger('snazzySelectionMade');
	    options.afterSelect();
	    ul.hide();
  	}
  	function liClick(e){
  	  var child = $(this).children("a");
  	  if(child.size() == 0){
	      selectLi($(this));
	    } else {
	      window.location = child.attr("href");
	    }
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
  	  if(!li.is("li")){
  	    li = li.closest("li");
  	  }
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