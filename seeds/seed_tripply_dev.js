exports.seed = function(knex, Promise) {
  return Promise.all([
    knex('trip').del()
      .then(function () {
        return Promise.all([
          // Inserts seed entries
          knex('trip').insert({
            title: 'Big Sur Cabin Retreat, September 30 - October 2nd', 
            tripLinkId: 'asahdf234kjhsdf245', 
            details: "Muffin apple pie bear claw muffin croissant sweet donut pie. Cotton candy soufflé caramels icing cake puddingdonut. Halvah biscuit toffee pudding tiramisu. Icing cookie liquorice macaroon gummies candy caramels sugar plum croissant. Danish gummies caramels danish topping candy jelly-o gummi bears. Lemon drops cake candy cake. Caramels gingerbread topping. Candy tiramisu dessert sesame snaps. Sugar plum chupa chups powder donut caramels. Muffin candy icing jelly beans. Powder fruitcake cake carrot cake marshmallow lollipop cake tiramisu. Tootsie roll cake apple pie.\n\nGummies jelly-o cheesecake. Muffin dragée cake croissant dessert wafer cheesecake caramels carrot cake. Marzipan gummi bears liquorice carrot cake marshmallow apple pie chupa chups gummies. Wafer cookie jelly tiramisu wafer cake jelly beans cookie. Brownie macaroon bear claw. Apple pie oat cake cookie biscuit croissant jelly beans lollipop. Candy icing sugar plum cupcake halvah fruitcake. Sesame snaps cake icing sweet gummies. Croissant tart bear claw. Sesame snaps cupcake croissant gummi bears gummies apple pie. Oat cake toffee cake halvah gingerbread muffin. Lemon drops danish toffee chupa chups sesame snaps carrot cake chocolate cake oat cake cupcake. Marzipan jelly beans candy candy canes.\n\nSesame snaps brownie sweet cheesecake topping. Bear claw cookie jelly beans jelly-o bonbon liquorice caramels. Bear claw muffin bonbon toffee chocolate jelly chupa chups brownie marzipan. Pastry oat cake dragée powder marshmallow lollipop. Marzipan jelly beans macaroon. Cookie tootsie roll dragée dessert dessert apple pie danish cupcake. Bonbon macaroon sweet candy canes gingerbread liquorice marshmallow bonbon marzipan. Dragée gingerbread jelly lemon drops jelly cake toffee. Gummi bears cake tiramisu brownie. Chocolate halvah pie caramels carrot cake. Candy chocolate bar lemon drops. Bonbon powder brownie. Oat cake oat cake cheesecake dessert cake.\n\nDragée chupa chups dessert gummi bears pudding carrot cake oat cake. Pie sugar plum lollipop lemon drops macaroon. Pastry oat cake caramels halvah. Topping jelly beans toffee caramels jujubes danish wafer. Candy toffee candy oat cake gummies toffee sugar plum. Toffee powder sugar plum macaroon chupa chups brownie cotton candy pudding sweet roll. Biscuit carrot cake bear claw sweet sweet roll biscuit liquorice. Carrot cake dessert chocolate cake oat cake. Topping chocolate tart ice cream powder oat cake. Tart halvah toffee tootsie roll carrot cake cookie oat cake cake. Tart macaroon caramels brownie tootsie roll. Fruitcake tiramisu ice cream. Chocolate soufflé sugar plum gummies gingerbread. Jelly beans liquorice caramels fruitcake ice cream fruitcake sugar plum apple pie."
          }).returning('id'),
        ]);
      }),
    knex('choice').del()
      .then(function () {
        return Promise.all([
          // Inserts seed entries
          knex('choice').insert({
            trip_id: 1,
            location: 'Big Sur, CA',
            price: '$240',
            image: "https://a2.muscache.com/im/pictures/69358559/eecdacaa_original.jpg?aki_policy=large",
            description: "Gorgeous Ocean Front Property",
            likes: 2,
            link: '',
            booked: false,
          }).returning('id'),
        ]);
      }),
    knex('images').del()
      .then(function () {
        return Promise.all([
          // Inserts seed entries
          knex('images').insert({
            choices_id: 1,
            image: "https://a2.muscache.com/im/pictures/69358559/eecdacaa_original.jpg?aki_policy=large"
          }).returning('id'),
        ]);
      }),
    knex('attendees').del()
      .then(function () {
         return Promise.all([
          // Inserts seed entries
          knex('attendees').insert({
            trip_id: 1,
            name: 'Charlene',
            status: 'paid'
            notes: 'Room for 2 more in my car'
          }).returning('id'),
        ]);
      }),
    knex('packing').del()
      .then(function () {
         return Promise.all([
          // Inserts seed entries
          knex('packing').insert({
            trip_id: 1,
            thingsToBring: 'Dinner Saturday',
            whosBringingIt: 'Gabe'
            notes: 'Carnitas!'
          }).returning('id'),
        ]);
      })
  ])
} 

















