require("spec_helper.js");
require("../jquery.snazzyselect.js");

Screw.Unit(function(){
  describe("Snazzy Select", function(){
    before(function() { 
      var fixtures = $('#fixtures').empty();
      $('ul.snazzy_select').remove();
      var container = $('<div />').appendTo(fixtures);
      div = $('<div />').appendTo(container).addClass('snazzy_selected');
      select = $('<select />').appendTo(container).append('<option>Everyone</option>').append("<option selected='selected' value='sean'>Sean Cashin</option>").append("<option value='ryan'>Ryan Sonnek</option>").snazzySelect();
      snazzySelect = $('ul.snazzy_select');
    });
    it("automatically hides the select input", function(){
      expect(select.is(":hidden")).to(equal, true);
    });
    it("initializes div with text from selected option", function(){
      expect(div.html().replace(/\<.*/, '')).to(equal, 'Sean Cashin');
    });
    it('automatically creates a hidden unordered list with options from select input', function() {
      expect(snazzySelect.size()).to(equal, 1);
      expect(snazzySelect.is(':hidden')).to(equal, true);
      expect(snazzySelect.find('li').size()).to(equal, 3);
    });

    describe("clicking on the div", function() {
      before(function() {
        div.click();
      });
      it('shows the snazzy list', function(){
        expect(snazzySelect.is(":visible")).to(equal, true);
      });
    });

    describe("selecting element from list via mouse click", function() {
      before(function(){
        div.click();
        selected = snazzySelect.find('li:last');
        selected.click();
      });
      it('updates text of div to match text of selected element', function(){
        expect(div.html().replace(/\<.*/, '')).to(equal, selected.text());
      });
      it('hides snazzy list', function(){
        expect(snazzySelect.is(":hidden")).to(equal, true);
      });
      it('highlights selected element', function(){
        expect(selected.hasClass('snazzy_hover')).to(equal, true);
        expect(selected.hasClass('snazzy_current')).to(equal, true);
      });
    });
  });
});
