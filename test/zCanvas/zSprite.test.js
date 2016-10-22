var chai          = require( "chai" );
var MockedBrowser = require( "../utils/MockedBrowser" );
var zCanvas       = require( "../../src/zCanvas" );
var zSprite       = require( "../../src/zSprite" );

describe( "zSprite", function()
{
    /* setup */

    // use Chai assertion library
    var assert = chai.assert,
        expect = chai.expect;

    var canvas;
    var x, y, width, height, bitmap, collidable;

    // executed before the tests start running

    before( function()
    {
        // prepare mock browser
        MockedBrowser.init();

        // prepare Canvas
        canvas = new zCanvas( 200, 200 );

        // prepare 1x1 red PNG as Bitmap
        bitmap = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP4z8DwHwAFAAH/VscvDQAAAABJRU5ErkJggg==";
    });

    // executed when all tests have finished running

    after( function()
    {

    });

    // executed before each individual test

    beforeEach( function()
    {
        // generate random values for coordinates and dimensions
        x      = Math.round( Math.random() * 100 ) + 1;
        y      = Math.round( Math.random() * 100 ) + 1;
        width  = Math.round( Math.random() * 100 ) + 10;
        height = Math.round( Math.random() * 100 ) + 10;

        // random values for optional properties
        collidable = Math.random() > .5;
    });

    // executed after each individual test

    afterEach( function()
    {
        while ( canvas.numChildren() > 0 )
        {
            var sprite = canvas.removeChildAt( 0 );
            sprite.dispose();
        }
    });

    /* actual unit tests */

    it( "should not construct without valid arguments", function()
    {
        expect( function()
        {
            new zSprite();

        }).to.throw( /cannot construct a zSprite without valid coordinates and dimensions/ );

        expect( function()
        {
            new zSprite( x );

        }).to.throw( /cannot construct a zSprite without valid coordinates and dimensions/ );

        expect( function()
        {
            new zSprite( x, y );

        }).to.throw( /cannot construct a zSprite without valid coordinates and dimensions/ );

        expect( function()
        {
            new zSprite( x, y, width );

        }).to.throw( /cannot construct a zSprite without valid coordinates and dimensions/ );

        expect( function()
        {
            new zSprite( x, y, width, height );

        }).not.to.throw();

        expect( function()
        {
            new zSprite( x, y, width, height, {} );

        }).to.throw( /expected Image or String for Image source/ );

        expect( function()
        {
            new zSprite( x, y, width, height, bitmap );

        }).not.to.throw();
    });

    it( "should be able to extend its prototype into new function references", function()
    {
        var newClass = function() {};

        zSprite.extend( newClass );

        assert.ok( new newClass() instanceof zSprite,
            "expected an instance of newClass to equal the zSprite prototype" );
    });

    it( "should return the construction arguments unchanged", function()
    {
        var sprite = new zSprite( x, y, width, height, bitmap, collidable );

        assert.strictEqual( x, sprite.getX(),
            "expected x to be " + x + " got " + sprite.getX() + " instead" );

        assert.strictEqual( y, sprite.getY(),
            "expected y to be " + y + " got " + sprite.getY() + " instead" );

        assert.strictEqual( width, sprite.getWidth(),
            "expected width to be " + width + " got " + sprite.getWidth() + " instead" );

        assert.strictEqual( height, sprite.getHeight(),
            "expected height to be " + height + " got " + sprite.getHeight() + " instead" );

        assert.strictEqual( collidable, sprite.collidable,
            "expected collidable to be " + collidable + " got " + sprite.collidable + " instead");
    });

    it( "should be able to toggle its draggable state", function()
    {
        var sprite = new zSprite( x, y, width, height );

        assert.strictEqual( false, sprite.getDraggable(),
            "expected sprite not to be draggable after construction" );

        sprite.setDraggable( true );

        assert.strictEqual( true, sprite.getDraggable(),
            "expected sprite to be draggable after setDraggable( true )-invocation" );

        assert.strictEqual( true, sprite.getInteractive(),
            "expected sprite to be interactive after setDraggable( true )-invocation" );

        assert.strictEqual( false, sprite._keepInBounds,
            "expected sprite not to be kept within bounds without explicit invocation" );

        sprite.setDraggable( false );

        assert.strictEqual( false, sprite.getDraggable(),
            "expected sprite not to be draggable after setDraggable( false )-invocation" );

        sprite.setDraggable( true, true );

        assert.strictEqual( true, sprite._keepInBounds,
            "expected sprite to be kept within bounds without explicit invocation" );
    });

    it( "should be able to toggle its interactive state", function()
    {
        var sprite = new zSprite( x, y, width, height );

        assert.strictEqual( false, sprite.getInteractive(),
            "expected sprite not to be interactive after construction" );

        sprite.setInteractive( true );

        assert.strictEqual( true, sprite.getInteractive(),
            "expected sprite to be interactive after setInteractive( true )-invocation" );

        sprite.setInteractive( false );

        assert.strictEqual( false, sprite.getInteractive(),
            "expected sprite not to be interactive after setInteractive( false )-invocation" );
    });

    it( "should be able to update its coordinates", function()
    {
        var sprite = new zSprite( x, y, width, height );

        var newX = Math.round( Math.random() * 100 ) + 10;
        var newY = Math.round( Math.random() * 100 ) + 10;

        sprite.setX( newX );
        sprite.setY( newY );

        assert.strictEqual( newX, sprite.getX(),
            "expected x to be " + newX + ", got " + sprite.getX() + " instead" );

        assert.strictEqual( newY, sprite.getY(),
            "expected y to be " + newY + ", got " + sprite.getY() + " instead" );
    });

    it( "should be able to update its coordinates and its child coordinates recursively", function()
    {
        var sprite = new zSprite( x, y, width, height );

        var child1X = Math.round( Math.random() * 100 ) + 10;
        var child1Y = Math.round( Math.random() * 100 ) + 10;
        var child2X = Math.round( Math.random() * 100 ) + 10;
        var child2Y = Math.round( Math.random() * 100 ) + 10;

        var child1  = new zSprite( child1X, child1Y, width, height );
        var child2  = new zSprite( child2X, child2Y, width, height );

        // add child1 onto parent, add child2 onto child1
        sprite.addChild( child1 );
        child1.addChild( child2 );

        var newX            = Math.round( Math.random() * 100 ) + 10;
        var newY            = Math.round( Math.random() * 100 ) + 10;
        var expectedChild1X = child1X + ( newX - sprite.getX() );
        var expectedChild1Y = child1Y + ( newY - sprite.getY() );
        var expectedChild2X = child2X + ( expectedChild1X - child1.getX() );
        var expectedChild2Y = child2Y + ( expectedChild1Y - child1.getY() );

        // update coordinates
        sprite.setX( newX );
        sprite.setY( newY );

        // evaluate child1 coordinates

        assert.strictEqual( expectedChild1X, child1.getX(),
            "expected child 1 x to be " + expectedChild1X + ", got " + child1.getX() + " instead" );

        assert.strictEqual( expectedChild1Y, child1.getY(),
            "expected child 1 y to be " + expectedChild1Y + ", got " + child1.getY() + " instead" );

        // evaluate child2 coordinates

        assert.strictEqual( expectedChild2X, child2.getX(),
            "expected child 2 x to be " + expectedChild2X + ", got " + child2.getX() + " instead" );

        assert.strictEqual( expectedChild2Y, child2.getY(),
            "expected child 2 y to be " + expectedChild2Y + ", got " + child2.getY() + " instead" );
    });

    it( "should have a bounds rectangle describing its offset and dimensions", function()
    {
        var sprite = new zSprite( x, y, width, height );
        var bounds = sprite.getBounds();

        assert.strictEqual( x, bounds.left,
            "expected left to be " + x + ", got " + bounds.left + " instead" );

        assert.strictEqual( y, bounds.top,
            "expected top to be " + y + ", got " + bounds.top + " instead" );

        assert.strictEqual( width, bounds.width,
            "expected width to be " + width + ", got " + bounds.width + " instead" );

        assert.strictEqual( height, bounds.height,
            "expected height to be " + height + ", got " + bounds.height + " instead" );
    });

    it( "should invoke the update() method on its children recursively", function()
    {
        var updated         = 0;
        var expectedUpdates = 3;

        // hijack update Function

        var orgUpdateFn = zSprite.prototype.update;
        zSprite.prototype.update = function()
        {
            ++updated;
            orgUpdateFn.call( this );
        };

        var sprite = new zSprite( x, y, width, height );
        var child1 = new zSprite( x, y, width, height );
        var child2 = new zSprite( x, y, width, height );

        sprite.addChild( child1 );
        child1.addChild( child2 );

        // update

        sprite.update( 0 );

        // evaluate

        assert.strictEqual( expectedUpdates, updated,
            "expected " + expectedUpdates + " updates, got " + updated + " instead" );

        // restore update Function
        zSprite.prototype.update = orgUpdateFn;
    });

    it( "should be able to determine when it collides with another sprite", function()
    {
        var withinX = x + ( width  / 2 );
        var withinY = y + ( height / 2 );
        var outX    = x - width;
        var outY    = y + height;

        var sprite            = new zSprite( x, y, width, height );
        var spriteInBounds    = new zSprite( withinX, withinY, width, height );
        var spriteOutOfBounds = new zSprite( outX, outY, width, height );

        assert.ok( sprite.collidesWith( spriteInBounds ),
            "expected sprite to have collided with a within bounds Object, but it didn't" );

        assert.notOk( sprite.collidesWith( spriteOutOfBounds ),
            "expected sprite not to have collided with an out of bounds Object, but it did" );
    });

    it( "should be able to determine whether it collides with the edge of another sprite", function()
    {
        var sprite = new zSprite( x, y, width, height );

        assert.notOk( sprite.collidesWithEdge( sprite ),
            "expected sprite not collide with itself" );

        var sprite2 = new zSprite( x, y, width, height );
        canvas.addChild( sprite2 );

        expect( function()
        {
            sprite.collidesWithEdge( sprite2 );

        }).to.throw( /invalid argument for edge/ );

        // test left collision

        sprite2.setX( x + 1 );

        assert.ok( sprite.collidesWithEdge( sprite2, 0 ),
            "expected sprite to collide at the left of given sprite" );

        // test right collision

        sprite2.setX( x + width );

        assert.ok( sprite.collidesWithEdge( sprite2, 2 ),
            "expected sprite to collide at the right of given sprite" );

        // test top collision

        sprite2.setX( x );
        sprite2.setY( y + 1 );

        assert.ok( sprite.collidesWithEdge( sprite2, 1 ),
            "expected sprite to collide above the given sprite" );

        // test bottom collision

        sprite2.setY( y + height );

        assert.ok( sprite.collidesWithEdge( sprite2, 3 ),
            "expected sprite to collide below given sprite for coordinates: " + sprite.getY() + " vs " + sprite2.getY() );
    });

    it( "should be able to set a parent Sprite", function()
    {
        var sprite = new zSprite( x, y, width, height );
        var child  = new zSprite( x, y, width, height );

        assert.isNull( child.getParent(),
            "expected Sprite not have a parent after construction" );

        sprite.addChild( child );

        assert.strictEqual( sprite, child.getParent(),
            "expected return parent to match the expected parent" );

        sprite.removeChild( child );

        assert.isNull( child.getParent(),
            "expected Sprite not have a parent after removal from display list" );
    });

    it( "should by default set its constraints to the Canvas bounds", function()
    {
        var sprite = new zSprite( x, y, width, height );
        canvas.addChild( sprite );

        var constraint = sprite.getConstraint();

        assert.strictEqual( 0, constraint.left,
            "expected left constraint to be 0, got " + constraint.left );

        assert.strictEqual( 0, constraint.top,
            "expected top constraint to be 0, got " + constraint.top );

        assert.strictEqual( canvas.getWidth(), constraint.width,
            "expected constraints width to be " + canvas.getWidth() + ", got " + constraint.widtb );

        assert.strictEqual( canvas.getHeight(), constraint.height,
            "expected constraints height to be " + canvas.getHeight() + ", got " + constraint.height );
    });

    it( "should be able to define parent constraints", function()
    {
        var sprite  = new zSprite( x, y, width, height );

        var cX      = x - width;
        var cY      = y + height;
        var cWidth  = Math.round( width / 2 );
        var cHeight = Math.round( height / 2 );

        assert.notOk( sprite._keepInBounds,
            "expected sprite not be kept constraint o bounds prior to setting a constraint" );

        sprite.setConstraint( cX, cY, cWidth, cHeight );

        assert.ok( sprite._keepInBounds,
            "expected sprite to be kept within bounds after setting of constraint" );

        var constraint = sprite.getConstraint();

        assert.strictEqual( cX, constraint.left,
            "expected constraint left to be " + cX + ", got " + constraint.left + " instead" );

        assert.strictEqual( cY, constraint.top,
            "expected constraint top to be " + cY + ", got " + constraint.top + " instead" );

        assert.strictEqual( cWidth, constraint.width,
            "expected constraint width to be " + cWidth + ", got " + constraint.width + " instead" );

        assert.strictEqual( cHeight, constraint.height,
            "expected constraint height to be " + cHeight + ", got " + constraint.height + " instead" );
    });

    it( "should be able to add/remove children from its display list", function()
    {
        var sprite = new zSprite( x, y, width, height );
        var child  = new zSprite( x, y, width, height );

        assert.notOk( sprite.contains( child ),
            "expected sprite not to contain the child in its display list" );

        sprite.addChild( child );

        assert.ok( sprite.contains( child ),
            "expected sprite to contain the child in its display list after addition" );

        var removed = sprite.removeChild( child );

        assert.notOk( sprite.contains( child ),
            "expected sprite not to contain the child in its display list after removal" );

        assert.strictEqual( removed, child,
            "expected removed sprite to equal the requested sprite" );
    });

    it( "should be able to add/remove children from specific indices in its display list", function()
    {
        var sprite = new zSprite( x, y, width, height );
        var child1 = new zSprite( x, y, width, height );
        var child2 = new zSprite( x, y, width, height );
        var child3 = new zSprite( x, y, width, height );

        assert.strictEqual( 0, sprite.numChildren(),
            "expected the amount of children to be 0 after construction, got " + sprite.numChildren() + " instead" );

        sprite.addChild( child1 );

        assert.strictEqual( 1, sprite.numChildren(),
            "expected the amount of children to be 1 after addition of a sprite, got " + sprite.numChildren() + " instead" );

        sprite.addChild( child2 );

        assert.strictEqual( 2, sprite.numChildren(),
            "expected the amount of children to be 2 after addition of 2 sprites, got " + sprite.numChildren() + " instead" );

        assert.strictEqual( child1, sprite.getChildAt( 0 ),
            "expected the sprite at index 0 to equal the expected sprite" );

        assert.strictEqual( child2, sprite.getChildAt( 1 ),
            "expected the sprite at index 0 to equal the expected sprite" );

        sprite.addChild( child3 );

        // test removals

        var removed = sprite.removeChildAt( 2 );

        assert.strictEqual( 2, sprite.numChildren(),
            "expected the amount of children to be 2 after removal of 1 sprite, got " + sprite.numChildren() + " instead" );

        assert.strictEqual( removed, child3,
            "expected the removed child to equal the expected child" );

        removed = sprite.removeChildAt( 0 );

        assert.notOk( sprite.contains( child1 ),
            "expected child to have been removed from the display list" );

        assert.strictEqual( 1, sprite.numChildren(),
            "expected the amount of children to be 1 after removal of 1 sprite, got " + sprite.numChildren() + " instead" );

        assert.strictEqual( removed, child1,
            "expected removed child to equal the expected child" );

        removed = sprite.removeChildAt( 0 );

        assert.notOk( sprite.contains( child2 ),
            "expected the sprite to have been removed from the display list" );

        assert.strictEqual( 0, sprite.numChildren(),
            "expected the amount of children to be 0 after removal of 2 sprites, got " + sprite.numChildren() + " instead" );

        assert.ok( removed, child2,
            "expected removed child to equal the expected child" );
    });

    it( "should be able to maintain the linked list of its child sprites", function()
    {
        var canvas = new zCanvas( width, height );
        var sprite1 = new zSprite( 0, 0, width, height );
        var sprite2 = new zSprite( 0, 0, width, height );
        var sprite3 = new zSprite( 0, 0, width, height );

        assert.isNull( sprite1.next, "expected next Sprite to be null after construction" );
        assert.isNull( sprite1.last, "expected last Sprite to be null after construction" );

        // add first child

        canvas.addChild( sprite1 );

        assert.isNull( sprite1.last, "expected sprite1 not to have a last sibling" );
        assert.isNull( sprite1.next, "expected sprite1 not to have a next sibling" );

        // add second child

        canvas.addChild( sprite2 );

        assert.isNull( sprite1.last, "expected sprite1 not to have a previous sibling" );
        assert.strictEqual( sprite2, sprite1.next, "expected sprite2 to be the next sibling of sprite1" );
        assert.strictEqual( sprite1, sprite2.last, "expected sprite1 to be the last sibling of sprite2" );
        assert.isNull( sprite2.next, "expected sprite2 not to have a next sibling" );

        // add third child

        canvas.addChild( sprite3 );

        assert.isNull( sprite1.last, "expected sprite1 not to have a last sibling" );
        assert.strictEqual( sprite2, sprite1.next, "expected sprite2 to be the next sibling of sprite1" );
        assert.strictEqual( sprite1, sprite2.last, "expected sprite1 to be the last sibling of sprite2" );
        assert.strictEqual( sprite3, sprite2.next, "expected sprite3 to be the next sibling of sprite2" );
        assert.strictEqual( sprite2, sprite3.last, "expected sprite2 to be the last sibling of sprite3" );
        assert.isNull( sprite3.next, "expected sprite3 not to have a next sibling" );
    });

    it( "should be able to update the linked list of its child sprites", function()
    {
        var canvas = new zCanvas( width, height );
        var sprite1 = new zSprite( 0, 0, width, height );
        var sprite2 = new zSprite( 0, 0, width, height );
        var sprite3 = new zSprite( 0, 0, width, height );

        // add children

        canvas.addChild( sprite1 );
        canvas.addChild( sprite2 );
        canvas.addChild( sprite3 );

        // assert list is updated when middle child is removed

        canvas.removeChild( sprite2 );

        assert.isNull( sprite2.last, "expected sprite2 not to have a last sibling as it was removed" );
        assert.isNull( sprite2.next, "expected sprite2 not to have a next sibling as it was removed" );
        assert.strictEqual( sprite3, sprite1.next, "expected sprite3 to be the next sibling of sprite1" );
        assert.strictEqual( sprite1, sprite3.last, "expected sprite1 to be the last sibling of sprite3" );

        // remove last child

        canvas.removeChild( sprite3 );

        assert.isNull( sprite3.last, "expected sprite3 not to have a last sibling as it was removed" );
        assert.isNull( sprite3.next, "expected sprite3 not to have a next sibling as it was removed" );
        assert.isNull( sprite1.next, "expected sprite1 not to have a next sibling" );
    });

    // TODO: add updatePosition test

    it( "should be able to update its bitmap", function()
    {
        var sprite   = new zSprite( x, y, width, height, bitmap );
        var newImage = "foobaar";

        sprite.updateImage( newImage );

        assert.strictEqual( newImage, sprite._image.src,
           "expected sprites image to equal the new Image" );

        assert.strictEqual( width, sprite.getWidth(),
            "expected sprite width to be " + width + ", got " + sprite.getWidth() + " instead" );

        assert.strictEqual( height, sprite.getHeight(),
            "expected sprite width to be " + height + ", got " + sprite.getHeight() + " instead" );

        var expectedWidth  = width * 2;
        var expectedHeight = height * 2;

        sprite.updateImage( null, expectedWidth, expectedHeight );

        assert.strictEqual( newImage, sprite._image.src,
            "expected sprites image to equal the last set Image" );

        assert.strictEqual( expectedWidth, sprite.getWidth(),
            "expected sprite width to be " + expectedWidth + ", got " + sprite.getWidth() + " instead" );

        assert.strictEqual( expectedHeight, sprite.getHeight(),
            "expected sprite width to be " + expectedHeight + ", got " + sprite.getHeight() + " instead" );
    });

    it( "should be able to update its width", function()
    {
        var sprite = new zSprite( x, y, width, height, bitmap );
        var newWidth = width;

        while ( width === newWidth )
            newWidth = Math.round( Math.random() * 1000 );

        sprite.setWidth( newWidth );

        assert.strictEqual( newWidth, sprite.getWidth(),
            "expected sprite width to be " + newWidth + ", got " + sprite.getWidth() + " instead" );
    });

    it( "should be able to update its height", function()
    {
        var sprite = new zSprite( x, y, width, height, bitmap );
        var newHeight = height;

        while ( height === newHeight )
            newHeight = Math.round( Math.random() * 1000 );

        sprite.setHeight( newHeight );

        assert.strictEqual( newHeight, sprite.getHeight(),
            "expected sprite height to be " + newHeight + ", got " + sprite.getHeight() + " instead" );
    });
});
