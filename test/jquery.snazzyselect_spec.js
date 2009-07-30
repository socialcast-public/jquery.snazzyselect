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
    });
    it("automatically hides the select input", function(){
      expect(select.is(":hidden")).to(equal, true);
    });
    it("initializes div with text from selected option", function(){
      expect(div.html().replace(/\<.*/, '')).to(equal, 'Sean Cashin');
    });
    it('automatically creates a hidden unordered list with options from select input', function() {
      expect($('ul.snazzy_select').size()).to(equal, 1);
      expect($('ul.snazzy_select').is(':hidden')).to(equal, true);
      expect($('ul.snazzy_select li').size()).to(equal, 3);
    });
    it('shows the unordered list on div click', function(){
      div.click();
      expect($('ul.snazzy_select').is(":visible")).to(equal, true);
    });
    it('selects li that is clicked on, replaces div contents, and hides ul', function(){
      div.click();
      $('ul.snazzy_select li:last').click();
      expect($('ul.snazzy_select').is(":hidden")).to(equal, true);
      div.children("span").remove();
      expect(div.text()).to(equal, $("ul.snazzy_select li:last").text());
    });
    it('changes div wording to match the li clicked', function(){
      div.click();
      $('ul.snazzy_select li:last').click();
      div.children('span').remove();
      expect(div.text()).to(equal, $('ul.snazzy_select li:last').text());
    })
    it('highlights li that matches div', function(){
      div.click();
      $('ul.snazzy_select li:last').click();
      div.click();
      expect($('ul.snazzy_select li:last').hasClass('snazzy_hover')).to(equal, true);
      expect($('ul.snazzy_select li:last').hasClass('snazzy_current')).to(equal, true);
    });
  });
});
