/*global
	Registry, TraditionRegistry,
	Color,
	Fruit, PearFruit,
	Event, BirthdayEvent, TransferEvent,
	Basket, BigBasket, FruitBigBasket,
	Human, MaleHuman, FemaleHuman,
	InvalidArgumentError
*/
var util = require('util');

/**
 * "Origin"
 *
 * Based on a scene from an episode of Friday Night Dinner.
 *
 * @package Smoigel
 * @author Timo Tijhof, 2013
 */

var traditions = TraditionRegistry.getSingleton();

var e = new TransferEvent({
	spec: {
		from: {
			instanceof: Human
		},

		items: [SmoigelBasket],

		/**
		 * Custom validation.
		 * @param {Human} target
		 * @param {Event} concurrentEvent Instance of spec.when.
		 * @return {boolean}
		 */
		to: function (target, concurrentEvent) {
			// To the eldest son of the family, so, a male.
			return target instanceof MaleHuman &&
				// Validate the target is a child in the family of the home
				// the party subject lives in. Not a sibling per se, because
				// he or she could be either a child or a parent.
				// The gift should be given to the eldest son of the family he lives in
				// (not of the family the object is born in, per se).
				concurrentEvent.getSubject().getHomeFamily().getChildren().toArray().indexOf(target) !== -1 &&
				// Finally confirm he has no older siblings.
				target.siblings.sort(function (a, b) {
					return a.age < b.age;
				})[0] === target;
		},
		when: BirthdayEvent
	}
});

/**
 * A non-empty basket of green-coloured fruits
 * that are not pears.
 *
 * @class
 * @extends FruitBigBasket
 *
 * @constructor
 * @param {Array} items
 * @throws {InvalidArgumentError} If basket contains unexpected items.
 */
function SmoigelBasket(items) {
	SmoigelBasket.super_.apply(this, arguments);

	if (
		!items.length ||
			items.some(function (item) {
				return !item.color.isLike(Color.newFromKeyword('green')) || item instanceof PearFruit;
			})
	) {
		throw new InvalidArgumentError();
	}
}

util.inherits(SmoigelBasket, FruitBigBasket);

traditions.addEvent(e);
