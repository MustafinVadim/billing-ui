const GaEventHelper = window.GaEventHelper || null;

class GoogleAnalytics {
    static triggerEventsAsync(events) {
        if (Array.isArray(events)) {
            events.forEach(evt => {
                GoogleAnalytics.triggerEventAsync(evt.category, evt.action, evt.label, evt.value);
            });
        } else {
            GoogleAnalytics.triggerEventAsync(events.category, events.action, events.label, events.value);
        }
    }

    static triggerEventAsync(category, action, label, value) {
        GaEventHelper && GaEventHelper.publishEventAsync(category, action, label, value);
    }

    static customVar(name, value) {
        GaEventHelper && GaEventHelper.customVar(name, value);
    }
}

export default GoogleAnalytics;
