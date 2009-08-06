require("spec_helper.js");
require("../jquery.snazzyselect.js");

Screw.Unit(function(){
  describe("Snazzy Select", function(){
    before(function() { 
      var fixtures = $('#fixtures').empty();
      $('ul.snazzy_select').remove();
      form = $('<form />').appendTo(fixtures);
      var container = $('<div />').appendTo(form);
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
    it('fires change listener when element selected', function() {
      var changed = false;
      select.change(function() {
        changed = true;
      });
      div.click();
      snazzySelect.find('li:last').click();
      expect(changed).to(equal, true);
    });

    describe("clicking on the div", function() {
      before(function() {
        div.click();
      });
      it('shows the snazzy list', function(){
        expect(snazzySelect.is(":visible")).to(equal, true);
      });
      it('adds hover class to current element', function(){
        expect(snazzySelect.find('li.snazzy_current').hasClass('snazzy_hover')).to(equal, true);
      });
    });

    describe("clicking on the dropdown icon", function() {
      before(function() {
        div.find('span').click();
      });
      it('shows the snazzy list', function(){
        expect(snazzySelect.is(":visible")).to(equal, true);
      });
    });

    describe("clicking on the div twice", function() {
      before(function() {
        div.click();
        div.click();
      });
      it('hides the snazzy list', function(){
        expect(snazzySelect.is(":visible")).to(equal, false);
      });
    });

    describe("clicking on another element after dropdown is visible", function() {
      before(function() {
        div.click();
        $('#some_other_text').click();
      });
      it('hides the snazzy list', function(){
        expect(snazzySelect.is(":visible")).to(equal, false);
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
      it('adds current class to selected element', function(){
        expect(selected.hasClass('snazzy_current')).to(equal, true);
      });
    });

    describe('keyboard navigation', function() {
      it('down arrow hovers over next result', function() {
        div.click();
        e = $.Event("keydown");
        e.which = $.SnazzySelect.KEYS.DOWN;
        e.keyCode = $.SnazzySelect.KEYS.DOWN;
      	div.trigger(e);

        expect(snazzySelect.find('li.snazzy_hover').text()).to(equal, 'Ryan Sonnek');
      });
      it('up arrow hovers over previous result', function() {
        div.click();
        e = $.Event("keydown");
        e.which = $.SnazzySelect.KEYS.UP;
        e.keyCode = $.SnazzySelect.KEYS.UP;
      	div.trigger(e);

        expect(snazzySelect.find('li.snazzy_hover').text()).to(equal, 'Everyone');
      });
      it('escape key hides the snazzy select dropdown', function() {
        div.click();
        e = $.Event("keydown");
        e.which = $.SnazzySelect.KEYS.ESCAPE;
        e.keyCode = $.SnazzySelect.KEYS.ESCAPE;
      	div.trigger(e);

        expect(snazzySelect.is(':hidden')).to(equal, true);
      });
      it('return selects highlighted element', function() {
        div.click();
        e = $.Event("keydown");
        e.which = $.SnazzySelect.KEYS.UP;
        e.keyCode = $.SnazzySelect.KEYS.UP;
      	div.trigger(e);

        e = $.Event("keydown");
        e.which = $.SnazzySelect.KEYS.RETURN;
        e.keyCode = $.SnazzySelect.KEYS.RETURN;
      	div.trigger(e);

        expect(snazzySelect.find('li.snazzy_current').text()).to(equal, 'Everyone');
      });
      it('tab selects highlighted element', function() {
        div.click();
        e = $.Event("keydown");
        e.which = $.SnazzySelect.KEYS.UP;
        e.keyCode = $.SnazzySelect.KEYS.UP;
      	div.trigger(e);

        e = $.Event("keydown");
        e.which = $.SnazzySelect.KEYS.TAB;
        e.keyCode = $.SnazzySelect.KEYS.TAB;
      	div.trigger(e);

        expect(snazzySelect.find('li.snazzy_current').text()).to(equal, 'Everyone');
      });
    });

    describe("resetting the form", function() {
      before(function() {
        div.click();
        selected = snazzySelect.find('li:last');
        selected.click();
        form.each(function(){
          this.reset();
      	});
      });
      it('resets the selected text after event triggered', function() {
        //this test fails because the assertion runs before the reset handler
        //need to find a way to run this test after the setTimeout callback fires
        //expect(div.html().replace(/\<.*/, '')).to(equal, 'Everyone');
      });
    });

    describe('extra elements', function() {
      before(function() { 
        var fixtures = $('#fixtures').empty();
        $('ul.snazzy_select').remove();
        var container = $('<div />').appendTo(fixtures);
        div = $('<div />').appendTo(container).addClass('snazzy_selected');
        extraLink = $("<a href='http://google.com'>google it</a>");
        select = $('<select />').appendTo(container).append('<option>Everyone</option>').append("<option selected='selected' value='sean'>Sean Cashin</option>").append("<option value='ryan'>Ryan Sonnek</option>").snazzySelect({
          extraElements: extraLink
        });
        snazzySelect = $('ul.snazzy_select');
      });
      it('adds placeholder break element after options', function() {
        expect(snazzySelect.children('li').eq(3).hasClass('snazzy_break')).to(equal, true);
      });
      it('adds content to end of list', function() {
        expect(snazzySelect.children('li').eq(4).find('a').attr('href')).to(equal, extraLink.attr('href'));
      });
    });
  });
});
