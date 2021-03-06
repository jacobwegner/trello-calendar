var icalendar = require('icalendar');
var _ = require('underscore');

exports.generateIcal = function(currentUser, boards, params) {
    var ical = new icalendar.iCalendar();
    boards.each(function(board) {
        board.cards().each(function(card) {
            // no arm, no chocolate
            if (!card.get('badges').due) return;
            if (params &&
                params.only_me == 'true' &&
                !_(card.get('idMembers')).include(currentUser.id)) {
                return;
            }
            var description = card.get('desc');
            description += "\n\n"+ card.get('url');
            var event = new icalendar.VEvent(card.id);
            event.setSummary(card.get('name'));
            event.setDescription(description);
            event.setDate(card.get('badges').due, 60*60);
            event.addProperty('ATTACH', card.get('url'));
            event.addProperty('URL', card.get('url'));
            if (params && params.alarm != '-1') {
                comp = event.addComponent('VALARM');
                comp.addProperty('ACTION', 'DISPLAY');
                comp.addProperty('DESCRIPTION', 'Generated by trello calendar');
                comp.addProperty('TRIGGER', params.alarm);
            }
            ical.addComponent(event);
        });
    });
    return ical;
}
