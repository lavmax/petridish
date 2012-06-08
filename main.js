var app = window.app || {};

window.addEvent('domready', function() 
{
	// Check browser's compatibility. 
	// Comment rows you don't need in you app.
	if (!document.createElement("canvas").getContext) return; 		// Canvas support
	if (!localStorage) return;										// Local storage support
	if (!openDatabase) return;										// Index database support

	// First delete 'non javascript' and browsers warning
    document.body.empty();
    
    // Go
    app.mainScreen = new MainController();
    app.mainScreen.loadView(document.body);
});
