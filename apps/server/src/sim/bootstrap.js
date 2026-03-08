const { City, Station, TrackSegment, CargoContract } = require('./entities');

function seedWorldIfEmpty(engine) {
  const { entities } = engine.getState();
  if (entities.cities.length > 0) return;

  const cities = [
    new City({ id: 'city_paris', name: 'Paris', population: 2_100_000, passengerDemand: 1.2, cargoDemand: 1.1 }),
    new City({ id: 'city_lyon', name: 'Lyon', population: 522_000, passengerDemand: 1.0, cargoDemand: 1.0 }),
    new City({ id: 'city_marseille', name: 'Marseille', population: 870_000, passengerDemand: 1.1, cargoDemand: 1.3 }),
  ];

  const stations = [
    new Station({ id: 'station_paris', cityId: 'city_paris', name: 'Paris Centre' }),
    new Station({ id: 'station_lyon', cityId: 'city_lyon', name: 'Lyon Part-Dieu' }),
    new Station({ id: 'station_marseille', cityId: 'city_marseille', name: 'Marseille St-Charles' }),
  ];

  const trackSegments = [
    new TrackSegment({ id: 'track_pl', fromStationId: 'station_paris', toStationId: 'station_lyon', distanceKm: 465, electrified: true }),
    new TrackSegment({ id: 'track_lm', fromStationId: 'station_lyon', toStationId: 'station_marseille', distanceKm: 315, electrified: true }),
  ];

  const cargoContracts = [
    new CargoContract({
      id: 'contract_food_1',
      fromCityId: 'city_lyon',
      toCityId: 'city_marseille',
      tonsPerTick: 40,
      pricePerTon: 50,
      priority: 2,
      active: true,
    }),
  ];

  entities.cities = cities;
  entities.stations = stations;
  entities.trackSegments = trackSegments;
  entities.cargoContracts = cargoContracts;

  engine.save();
}

module.exports = {
  seedWorldIfEmpty,
};
