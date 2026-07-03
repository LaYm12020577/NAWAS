function setupTriggers() {
  // Remove existing triggers to avoid duplicates
  const triggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }

  // Every 5 minutes
  ScriptApp.newTrigger('syncAll')
      .timeBased()
      .everyMinutes(5)
      .create();
}
