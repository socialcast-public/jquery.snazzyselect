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
    it('shows the unordered list on div click', function(){
      div.click();
      expect(snazzySelect.is(":visible")).to(equal, true);
    });
    it('selects li that is clicked on, replaces div contents, and hides ul', function(){
      div.click();
      snazzySelect.find('li:last').click();
      expect(snazzySelect.is(":hidden")).to(equal, true);
      expect(div.html().replace(/\<.*/, '')).to(equal, snazzySelect.find("li:last").text());
    });
    it('changes div wording to match the li clicked', function(){
      div.click();
      snazzySelect.find('li:last').click();
      expect(div.html().replace(/\<.*/, '')).to(equal, snazzySelect.find('li:last').text());
    })
    it('highlights li that matches div', function(){
      div.click();
      snazzySelect.find('li:last').click();
      div.click();
      expect(snazzySelect.find('li:last').hasClass('snazzy_hover')).to(equal, true);
      expect(snazzySelect.find('li:last').hasClass('snazzy_current')).to(equal, true);
    });
  });
});
