const GaEventHelper = window.GaEventHelper || null;

class GoogleAnalytics {
    static triggerEventsAsync(events) {
        if (Array.isArray(events)) {
            events.forEach(evt => {
                GoogleAnalytics.triggerEventAsync(evt.category, evt.action, evt.label);
            });
        }
        else {
            GoogleAnalytics.triggerEventAsync(evt.category, evt.action, evt.label);
        }
    }

    static triggerEventAsync(category, action, label) {
        GaEventHelper && GaEventHelper.publishEventAsync(category, action, label);
    }

    static customVar(name, value) {
        GaEventHelper && GaEventHelper.customVar(name, value);
    }
}

export default GoogleAnalytics;
