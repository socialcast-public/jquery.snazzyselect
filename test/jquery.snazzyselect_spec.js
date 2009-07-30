require("spec_helper.js");
require("../jquery.snazzyselect.js");

Screw.Unit(function(){
  describe("Snazzy Select", function(){
    before(function() { 
      var fixtures = $('#fixtures').empty();
      $('ul.snazzy_select').remove();
      var container = $('<div />').appendTo(fixtures);
      $('<div />').appendTo(container).addClass('snazzy_selected');
      select = $('<select />').appendTo(container).append('<option>Everyone</option>').append("<option value='sean'>Sean Cashin</option>").append("<option value='ryan'>Ryan Sonnek</option>").snazzySelect();
    });
    it("automatically hides the select input", function(){
      expect(select.is(":hidden")).to(equal, true);
    });
    it('automatically creates a hidden unordered list with options from select input', function() {
      expect($('ul.snazzy_select').size()).to(equal, 1);
      expect($('ul.snazzy_select').is(':hidden')).to(equal, true);
      expect($('ul.snazzy_select li').size()).to(equal, 3);
    });
    it('shows the unordered list on div click', function(){
      $('.snazzy_selected').click();
      expect($('ul.snazzy_select').is(":visible")).to(equal, true);
    });
    it('selects li that is clicked on, replaces div contents, and hides ul', function(){
      $('.snazzy_selected').click();
      $('ul.snazzy_select li:last').click();
      expect($('ul.snazzy_select').is(":hidden")).to(equal, true);
      $('.snazzy_selected').children("span").remove();
      expect($('.snazzy_selected').text()).to(equal, $("ul.snazzy_select li:last").text());
    });
    it('changes div wording to match the li clicked', function(){
      $('.snazzy_selected').click();
      $('ul.snazzy_select li:last').click();
      $('.snazzy_selected').children('span').remove();
      expect($('.snazzy_selected').text()).to(equal, $('ul.snazzy_select li:last').text());
    })
    it('highlights li that matches div', function(){
      $('.snazzy_selected').click();
      $('ul.snazzy_select li:last').click();
      $('.snazzy_selected').click();
      expect($('ul.snazzy_select li:last').hasClass('snazzy_selected_item')).to(equal, true);
    });
  });
});
