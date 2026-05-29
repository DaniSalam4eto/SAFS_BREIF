// Aircraft database with realistic-enough perf values for SAFS Brief flight planning.
// Fields:
//   icao         ICAO type designator
//   name         Marketing / common name
//   category     airliner | regional | businessjet | turboprop | fighter | cargo | ga | helicopter
//   manufacturer Manufacturer name
//   engines      Number of engines
//   mtow         Max takeoff weight (kg)
//   oew          Operating empty weight (kg)
//   maxPax       Typical max passengers (or 0 for cargo/military)
//   cruiseMach   Typical cruise mach
//   cruiseTas    Cruise TAS (knots)
//   ceiling      Service ceiling (ft)
//   range        Range (nm)
//   fuelBurn     Typical cruise burn (kg/hr)
//   climbFt      Initial climb rate (ft/min)

export const AIRCRAFT = [
  // ----- Airbus airliners -----
  { icao: 'A318', name: 'Airbus A318',  category: 'airliner', manufacturer: 'Airbus',  engines: 2, mtow: 68000,  oew: 39500,  maxPax: 132, cruiseMach: 0.78, cruiseTas: 447, ceiling: 41000, range: 3100, fuelBurn: 2200, climbFt: 2500 },
  { icao: 'A319', name: 'Airbus A319',  category: 'airliner', manufacturer: 'Airbus',  engines: 2, mtow: 75500,  oew: 40800,  maxPax: 156, cruiseMach: 0.78, cruiseTas: 447, ceiling: 41000, range: 3700, fuelBurn: 2400, climbFt: 2400 },
  { icao: 'A20N', name: 'Airbus A320neo', category: 'airliner', manufacturer: 'Airbus', engines: 2, mtow: 79000, oew: 44300, maxPax: 194, cruiseMach: 0.78, cruiseTas: 450, ceiling: 39800, range: 3500, fuelBurn: 2300, climbFt: 2500 },
  { icao: 'A320', name: 'Airbus A320',  category: 'airliner', manufacturer: 'Airbus',  engines: 2, mtow: 78000,  oew: 42600,  maxPax: 180, cruiseMach: 0.78, cruiseTas: 447, ceiling: 39000, range: 3300, fuelBurn: 2500, climbFt: 2400 },
  { icao: 'A321', name: 'Airbus A321',  category: 'airliner', manufacturer: 'Airbus',  engines: 2, mtow: 93500,  oew: 48500,  maxPax: 220, cruiseMach: 0.78, cruiseTas: 447, ceiling: 39000, range: 3200, fuelBurn: 2700, climbFt: 2200 },
  { icao: 'A21N', name: 'Airbus A321neo', category: 'airliner', manufacturer: 'Airbus', engines: 2, mtow: 97000, oew: 50300, maxPax: 240, cruiseMach: 0.78, cruiseTas: 450, ceiling: 39800, range: 4000, fuelBurn: 2600, climbFt: 2300 },
  { icao: 'A332', name: 'Airbus A330-200', category: 'airliner', manufacturer: 'Airbus', engines: 2, mtow: 233000, oew: 120600, maxPax: 293, cruiseMach: 0.82, cruiseTas: 470, ceiling: 41100, range: 7250, fuelBurn: 5600, climbFt: 2000 },
  { icao: 'A333', name: 'Airbus A330-300', category: 'airliner', manufacturer: 'Airbus', engines: 2, mtow: 242000, oew: 124500, maxPax: 335, cruiseMach: 0.82, cruiseTas: 470, ceiling: 41100, range: 6350, fuelBurn: 5800, climbFt: 2000 },
  { icao: 'A339', name: 'Airbus A330-900neo', category: 'airliner', manufacturer: 'Airbus', engines: 2, mtow: 251000, oew: 137000, maxPax: 310, cruiseMach: 0.82, cruiseTas: 470, ceiling: 41100, range: 7200, fuelBurn: 5200, climbFt: 2000 },
  { icao: 'A359', name: 'Airbus A350-900', category: 'airliner', manufacturer: 'Airbus', engines: 2, mtow: 280000, oew: 142400, maxPax: 325, cruiseMach: 0.85, cruiseTas: 488, ceiling: 43100, range: 8100, fuelBurn: 5400, climbFt: 2200 },
  { icao: 'A35K', name: 'Airbus A350-1000', category: 'airliner', manufacturer: 'Airbus', engines: 2, mtow: 319000, oew: 155000, maxPax: 369, cruiseMach: 0.85, cruiseTas: 488, ceiling: 43100, range: 8400, fuelBurn: 6100, climbFt: 2000 },
  { icao: 'A388', name: 'Airbus A380-800', category: 'airliner', manufacturer: 'Airbus', engines: 4, mtow: 575000, oew: 277000, maxPax: 555, cruiseMach: 0.85, cruiseTas: 488, ceiling: 43000, range: 8000, fuelBurn: 11500, climbFt: 1500 },
  { icao: 'A225', name: 'Antonov AN-225 Mriya', category: 'cargo', manufacturer: 'Antonov', engines: 6, mtow: 640000, oew: 285000, maxPax: 0, cruiseMach: 0.74, cruiseTas: 430, ceiling: 36000, range: 8000, fuelBurn: 12500, climbFt: 1200 },

  // ----- Boeing airliners -----
  { icao: 'B712', name: 'Boeing 717-200', category: 'airliner', manufacturer: 'Boeing', engines: 2, mtow: 54900, oew: 30800, maxPax: 134, cruiseMach: 0.77, cruiseTas: 438, ceiling: 37000, range: 2060, fuelBurn: 2100, climbFt: 2400 },
  { icao: 'B722', name: 'Boeing 727-200', category: 'airliner', manufacturer: 'Boeing', engines: 3, mtow: 95000, oew: 45900, maxPax: 189, cruiseMach: 0.80, cruiseTas: 460, ceiling: 42000, range: 2400, fuelBurn: 3800, climbFt: 2500 },
  { icao: 'B732', name: 'Boeing 737-200', category: 'airliner', manufacturer: 'Boeing', engines: 2, mtow: 52400, oew: 27500, maxPax: 130, cruiseMach: 0.74, cruiseTas: 420, ceiling: 35000, range: 1900, fuelBurn: 2500, climbFt: 2200 },
  { icao: 'B737', name: 'Boeing 737-700', category: 'airliner', manufacturer: 'Boeing', engines: 2, mtow: 70080, oew: 38150, maxPax: 149, cruiseMach: 0.78, cruiseTas: 447, ceiling: 41000, range: 3010, fuelBurn: 2400, climbFt: 2500 },
  { icao: 'B738', name: 'Boeing 737-800', category: 'airliner', manufacturer: 'Boeing', engines: 2, mtow: 79000, oew: 41413, maxPax: 189, cruiseMach: 0.78, cruiseTas: 453, ceiling: 41000, range: 2935, fuelBurn: 2500, climbFt: 2500 },
  { icao: 'B739', name: 'Boeing 737-900ER', category: 'airliner', manufacturer: 'Boeing', engines: 2, mtow: 85100, oew: 44676, maxPax: 220, cruiseMach: 0.78, cruiseTas: 453, ceiling: 41000, range: 2950, fuelBurn: 2600, climbFt: 2400 },
  { icao: 'B38M', name: 'Boeing 737 MAX 8', category: 'airliner', manufacturer: 'Boeing', engines: 2, mtow: 82190, oew: 45065, maxPax: 210, cruiseMach: 0.79, cruiseTas: 453, ceiling: 41000, range: 3550, fuelBurn: 2200, climbFt: 2500 },
  { icao: 'B39M', name: 'Boeing 737 MAX 9', category: 'airliner', manufacturer: 'Boeing', engines: 2, mtow: 88300, oew: 47570, maxPax: 220, cruiseMach: 0.79, cruiseTas: 453, ceiling: 41000, range: 3550, fuelBurn: 2300, climbFt: 2400 },
  { icao: 'B752', name: 'Boeing 757-200', category: 'airliner', manufacturer: 'Boeing', engines: 2, mtow: 115900, oew: 57975, maxPax: 239, cruiseMach: 0.80, cruiseTas: 470, ceiling: 42000, range: 3915, fuelBurn: 3500, climbFt: 3500 },
  { icao: 'B763', name: 'Boeing 767-300ER', category: 'airliner', manufacturer: 'Boeing', engines: 2, mtow: 186880, oew: 90011, maxPax: 269, cruiseMach: 0.80, cruiseTas: 470, ceiling: 43100, range: 5990, fuelBurn: 4500, climbFt: 2200 },
  { icao: 'B772', name: 'Boeing 777-200ER', category: 'airliner', manufacturer: 'Boeing', engines: 2, mtow: 297560, oew: 142900, maxPax: 314, cruiseMach: 0.84, cruiseTas: 482, ceiling: 43100, range: 7065, fuelBurn: 6800, climbFt: 2000 },
  { icao: 'B77W', name: 'Boeing 777-300ER', category: 'airliner', manufacturer: 'Boeing', engines: 2, mtow: 351530, oew: 167829, maxPax: 396, cruiseMach: 0.84, cruiseTas: 482, ceiling: 43100, range: 7370, fuelBurn: 7400, climbFt: 1900 },
  { icao: 'B77L', name: 'Boeing 777F',     category: 'cargo',    manufacturer: 'Boeing', engines: 2, mtow: 347452, oew: 145150, maxPax: 0,   cruiseMach: 0.84, cruiseTas: 482, ceiling: 43100, range: 4880, fuelBurn: 7000, climbFt: 2000 },
  { icao: 'B788', name: 'Boeing 787-8',    category: 'airliner', manufacturer: 'Boeing', engines: 2, mtow: 227930, oew: 119950, maxPax: 248, cruiseMach: 0.85, cruiseTas: 488, ceiling: 43000, range: 7305, fuelBurn: 5300, climbFt: 2300 },
  { icao: 'B789', name: 'Boeing 787-9',    category: 'airliner', manufacturer: 'Boeing', engines: 2, mtow: 254690, oew: 128850, maxPax: 296, cruiseMach: 0.85, cruiseTas: 488, ceiling: 43000, range: 7635, fuelBurn: 5500, climbFt: 2200 },
  { icao: 'B78X', name: 'Boeing 787-10',   category: 'airliner', manufacturer: 'Boeing', engines: 2, mtow: 254011, oew: 135500, maxPax: 336, cruiseMach: 0.85, cruiseTas: 488, ceiling: 43000, range: 6430, fuelBurn: 5700, climbFt: 2100 },
  { icao: 'B744', name: 'Boeing 747-400',  category: 'airliner', manufacturer: 'Boeing', engines: 4, mtow: 396890, oew: 178756, maxPax: 416, cruiseMach: 0.85, cruiseTas: 488, ceiling: 43100, range: 7260, fuelBurn: 10400, climbFt: 1800 },
  { icao: 'B748', name: 'Boeing 747-8I',   category: 'airliner', manufacturer: 'Boeing', engines: 4, mtow: 447696, oew: 220128, maxPax: 467, cruiseMach: 0.86, cruiseTas: 492, ceiling: 43100, range: 7790, fuelBurn: 11000, climbFt: 1800 },

  // ----- Regional -----
  { icao: 'E170', name: 'Embraer 170',   category: 'regional', manufacturer: 'Embraer', engines: 2, mtow: 38600, oew: 21140, maxPax: 78,  cruiseMach: 0.78, cruiseTas: 447, ceiling: 41000, range: 2100, fuelBurn: 1400, climbFt: 2700 },
  { icao: 'E190', name: 'Embraer 190',   category: 'regional', manufacturer: 'Embraer', engines: 2, mtow: 51800, oew: 27720, maxPax: 114, cruiseMach: 0.78, cruiseTas: 447, ceiling: 41000, range: 2400, fuelBurn: 1700, climbFt: 2600 },
  { icao: 'E195', name: 'Embraer 195',   category: 'regional', manufacturer: 'Embraer', engines: 2, mtow: 52290, oew: 28100, maxPax: 124, cruiseMach: 0.78, cruiseTas: 447, ceiling: 41000, range: 2200, fuelBurn: 1800, climbFt: 2500 },
  { icao: 'E75L', name: 'Embraer 175',   category: 'regional', manufacturer: 'Embraer', engines: 2, mtow: 38790, oew: 21810, maxPax: 88,  cruiseMach: 0.78, cruiseTas: 447, ceiling: 41000, range: 2100, fuelBurn: 1500, climbFt: 2600 },
  { icao: 'CRJ7', name: 'Bombardier CRJ-700', category: 'regional', manufacturer: 'Bombardier', engines: 2, mtow: 32999, oew: 19840, maxPax: 78, cruiseMach: 0.78, cruiseTas: 447, ceiling: 41000, range: 1378, fuelBurn: 1450, climbFt: 2500 },
  { icao: 'CRJ9', name: 'Bombardier CRJ-900', category: 'regional', manufacturer: 'Bombardier', engines: 2, mtow: 38330, oew: 21433, maxPax: 90, cruiseMach: 0.78, cruiseTas: 447, ceiling: 41000, range: 1550, fuelBurn: 1500, climbFt: 2400 },
  { icao: 'BCS1', name: 'Airbus A220-100',    category: 'regional', manufacturer: 'Airbus',     engines: 2, mtow: 60781, oew: 35221, maxPax: 135, cruiseMach: 0.78, cruiseTas: 447, ceiling: 41000, range: 3100, fuelBurn: 1900, climbFt: 2600 },
  { icao: 'BCS3', name: 'Airbus A220-300',    category: 'regional', manufacturer: 'Airbus',     engines: 2, mtow: 67585, oew: 37081, maxPax: 160, cruiseMach: 0.78, cruiseTas: 447, ceiling: 41000, range: 3350, fuelBurn: 2000, climbFt: 2500 },

  // ----- Business / private jets -----
  { icao: 'GLF6', name: 'Gulfstream G650',  category: 'businessjet', manufacturer: 'Gulfstream', engines: 2, mtow: 45178, oew: 24948, maxPax: 19, cruiseMach: 0.85, cruiseTas: 488, ceiling: 51000, range: 7000, fuelBurn: 1500, climbFt: 3500 },
  { icao: 'GLF5', name: 'Gulfstream G550',  category: 'businessjet', manufacturer: 'Gulfstream', engines: 2, mtow: 41277, oew: 21909, maxPax: 18, cruiseMach: 0.85, cruiseTas: 488, ceiling: 51000, range: 6750, fuelBurn: 1400, climbFt: 3000 },
  { icao: 'C56X', name: 'Cessna Citation Excel', category: 'businessjet', manufacturer: 'Cessna', engines: 2, mtow: 9163, oew: 5602, maxPax: 8,  cruiseMach: 0.75, cruiseTas: 430, ceiling: 45000, range: 1840, fuelBurn: 700, climbFt: 3500 },
  { icao: 'C68A', name: 'Cessna Citation Latitude', category: 'businessjet', manufacturer: 'Cessna', engines: 2, mtow: 13608, oew: 8754, maxPax: 9, cruiseMach: 0.80, cruiseTas: 446, ceiling: 45000, range: 2700, fuelBurn: 850, climbFt: 3400 },
  { icao: 'CL35', name: 'Bombardier Challenger 350', category: 'businessjet', manufacturer: 'Bombardier', engines: 2, mtow: 18416, oew: 11860, maxPax: 10, cruiseMach: 0.83, cruiseTas: 470, ceiling: 45000, range: 3200, fuelBurn: 1000, climbFt: 3500 },
  { icao: 'CL60', name: 'Bombardier Challenger 605', category: 'businessjet', manufacturer: 'Bombardier', engines: 2, mtow: 21863, oew: 12338, maxPax: 12, cruiseMach: 0.82, cruiseTas: 459, ceiling: 41000, range: 4000, fuelBurn: 1100, climbFt: 3000 },
  { icao: 'F2TH', name: 'Dassault Falcon 2000', category: 'businessjet', manufacturer: 'Dassault', engines: 2, mtow: 19142, oew: 9842, maxPax: 10, cruiseMach: 0.80, cruiseTas: 459, ceiling: 47000, range: 3000, fuelBurn: 950, climbFt: 3500 },
  { icao: 'F900', name: 'Dassault Falcon 900', category: 'businessjet', manufacturer: 'Dassault', engines: 3, mtow: 22500, oew: 11227, maxPax: 14, cruiseMach: 0.84, cruiseTas: 481, ceiling: 51000, range: 4500, fuelBurn: 1300, climbFt: 3700 },
  { icao: 'PRM1', name: 'Beechcraft Premier 1A', category: 'businessjet', manufacturer: 'Beechcraft', engines: 2, mtow: 5670, oew: 3717, maxPax: 6, cruiseMach: 0.78, cruiseTas: 451, ceiling: 41000, range: 1500, fuelBurn: 500, climbFt: 3300 },
  { icao: 'LJ45', name: 'Learjet 45',      category: 'businessjet', manufacturer: 'Bombardier', engines: 2, mtow: 9752, oew: 6123, maxPax: 9,  cruiseMach: 0.81, cruiseTas: 463, ceiling: 51000, range: 2000, fuelBurn: 700, climbFt: 4000 },

  // ----- Turboprops -----
  { icao: 'AT72', name: 'ATR 72-600',     category: 'turboprop', manufacturer: 'ATR',          engines: 2, mtow: 23000, oew: 13311, maxPax: 78, cruiseMach: 0.50, cruiseTas: 275, ceiling: 25000, range: 825, fuelBurn: 650, climbFt: 1600 },
  { icao: 'AT45', name: 'ATR 42-500',     category: 'turboprop', manufacturer: 'ATR',          engines: 2, mtow: 18600, oew: 11250, maxPax: 50, cruiseMach: 0.48, cruiseTas: 265, ceiling: 25000, range: 840, fuelBurn: 580, climbFt: 1500 },
  { icao: 'DH8D', name: 'Bombardier Q400', category: 'turboprop', manufacturer: 'Bombardier', engines: 2, mtow: 29257, oew: 17819, maxPax: 86, cruiseMach: 0.55, cruiseTas: 360, ceiling: 27000, range: 1100, fuelBurn: 770, climbFt: 1700 },
  { icao: 'C208', name: 'Cessna Caravan',  category: 'turboprop', manufacturer: 'Cessna',     engines: 1, mtow: 3969,  oew: 2073,  maxPax: 9,  cruiseMach: 0.30, cruiseTas: 186, ceiling: 25000, range: 964, fuelBurn: 175, climbFt: 975 },
  { icao: 'PC12', name: 'Pilatus PC-12',   category: 'turboprop', manufacturer: 'Pilatus',    engines: 1, mtow: 4740,  oew: 2787,  maxPax: 9,  cruiseMach: 0.48, cruiseTas: 285, ceiling: 30000, range: 1845, fuelBurn: 200, climbFt: 1900 },
  { icao: 'TBM9', name: 'Daher TBM 900',   category: 'turboprop', manufacturer: 'Daher',      engines: 1, mtow: 3354,  oew: 2123,  maxPax: 6,  cruiseMach: 0.54, cruiseTas: 330, ceiling: 31000, range: 1730, fuelBurn: 170, climbFt: 2380 },

  // ----- Fighters & military jets -----
  { icao: 'F16',  name: 'F-16 Fighting Falcon', category: 'fighter', manufacturer: 'Lockheed Martin', engines: 1, mtow: 19200, oew: 8570, maxPax: 1, cruiseMach: 1.20, cruiseTas: 700, ceiling: 50000, range: 2280, fuelBurn: 4000, climbFt: 50000 },
  { icao: 'F18',  name: 'F/A-18 Super Hornet',  category: 'fighter', manufacturer: 'Boeing',         engines: 2, mtow: 29937, oew: 14552, maxPax: 1, cruiseMach: 1.10, cruiseTas: 660, ceiling: 50000, range: 1275, fuelBurn: 4500, climbFt: 44000 },
  { icao: 'F22',  name: 'F-22 Raptor',          category: 'fighter', manufacturer: 'Lockheed Martin', engines: 2, mtow: 38000, oew: 19700, maxPax: 1, cruiseMach: 1.82, cruiseTas: 1050, ceiling: 65000, range: 1840, fuelBurn: 6000, climbFt: 62000 },
  { icao: 'F35',  name: 'F-35 Lightning II',    category: 'fighter', manufacturer: 'Lockheed Martin', engines: 1, mtow: 31752, oew: 13290, maxPax: 1, cruiseMach: 1.60, cruiseTas: 900, ceiling: 50000, range: 1380, fuelBurn: 5000, climbFt: 45000 },
  { icao: 'EUFI', name: 'Eurofighter Typhoon',  category: 'fighter', manufacturer: 'Eurofighter',     engines: 2, mtow: 23500, oew: 11000, maxPax: 1, cruiseMach: 1.50, cruiseTas: 870, ceiling: 55000, range: 1800, fuelBurn: 4500, climbFt: 62000 },
  { icao: 'RFAL', name: 'Dassault Rafale',      category: 'fighter', manufacturer: 'Dassault',        engines: 2, mtow: 24500, oew: 10300, maxPax: 1, cruiseMach: 1.40, cruiseTas: 830, ceiling: 50000, range: 1900, fuelBurn: 4400, climbFt: 60000 },
  { icao: 'GRIP', name: 'Saab JAS 39 Gripen',   category: 'fighter', manufacturer: 'Saab',            engines: 1, mtow: 16500, oew: 7100,  maxPax: 1, cruiseMach: 1.20, cruiseTas: 720, ceiling: 50000, range: 1990, fuelBurn: 3500, climbFt: 60000 },
  { icao: 'A10',  name: 'A-10 Thunderbolt II',  category: 'fighter', manufacturer: 'Fairchild',       engines: 2, mtow: 23000, oew: 11300, maxPax: 1, cruiseMach: 0.56, cruiseTas: 340, ceiling: 45000, range: 695,  fuelBurn: 1800, climbFt: 6000 },
  { icao: 'F15',  name: 'F-15 Eagle',           category: 'fighter', manufacturer: 'Boeing',          engines: 2, mtow: 30845, oew: 12973, maxPax: 1, cruiseMach: 0.90, cruiseTas: 570, ceiling: 65000, range: 3000, fuelBurn: 5500, climbFt: 50000 },
  { icao: 'F14',  name: 'F-14 Tomcat',          category: 'fighter', manufacturer: 'Grumman',         engines: 2, mtow: 33724, oew: 19838, maxPax: 2, cruiseMach: 0.95, cruiseTas: 575, ceiling: 50000, range: 1840, fuelBurn: 5500, climbFt: 45000 },
  { icao: 'MI24', name: 'Mil Mi-24 Hind',       category: 'helicopter', manufacturer: 'Mil',          engines: 2, mtow: 12000, oew: 8500,  maxPax: 8, cruiseMach: 0.23, cruiseTas: 145, ceiling: 14750, range: 450, fuelBurn: 800, climbFt: 2000 },

  // ----- Cargo / utility -----
  { icao: 'C17',  name: 'C-17 Globemaster III', category: 'cargo', manufacturer: 'Boeing',    engines: 4, mtow: 265350, oew: 122016, maxPax: 0, cruiseMach: 0.74, cruiseTas: 430, ceiling: 45000, range: 2420, fuelBurn: 7600, climbFt: 2500 },
  { icao: 'C130', name: 'Lockheed C-130 Hercules', category: 'cargo', manufacturer: 'Lockheed', engines: 4, mtow: 70307, oew: 34686, maxPax: 0, cruiseMach: 0.55, cruiseTas: 320, ceiling: 28000, range: 2050, fuelBurn: 2900, climbFt: 1830 },
  { icao: 'B748F', name: 'Boeing 747-8F',       category: 'cargo', manufacturer: 'Boeing',    engines: 4, mtow: 447696, oew: 197131, maxPax: 0, cruiseMach: 0.86, cruiseTas: 492, ceiling: 43100, range: 4390, fuelBurn: 11000, climbFt: 1800 },

  // ----- General aviation -----
  { icao: 'C172', name: 'Cessna 172 Skyhawk',  category: 'ga', manufacturer: 'Cessna',   engines: 1, mtow: 1157, oew: 767, maxPax: 4, cruiseMach: 0.18, cruiseTas: 122, ceiling: 14000, range: 640, fuelBurn: 30, climbFt: 730 },
  { icao: 'C152', name: 'Cessna 152',          category: 'ga', manufacturer: 'Cessna',   engines: 1, mtow: 757,  oew: 490, maxPax: 2, cruiseMach: 0.17, cruiseTas: 107, ceiling: 14700, range: 415, fuelBurn: 22, climbFt: 715 },
  { icao: 'P28A', name: 'Piper Cherokee',      category: 'ga', manufacturer: 'Piper',    engines: 1, mtow: 1100, oew: 666, maxPax: 4, cruiseMach: 0.18, cruiseTas: 124, ceiling: 14000, range: 522, fuelBurn: 35, climbFt: 660 },
  { icao: 'SR22', name: 'Cirrus SR22',         category: 'ga', manufacturer: 'Cirrus',   engines: 1, mtow: 1633, oew: 1024, maxPax: 4, cruiseMach: 0.27, cruiseTas: 183, ceiling: 17500, range: 1170, fuelBurn: 60, climbFt: 1270 },
  { icao: 'DA40', name: 'Diamond DA40',        category: 'ga', manufacturer: 'Diamond',  engines: 1, mtow: 1199, oew: 800, maxPax: 4, cruiseMach: 0.22, cruiseTas: 150, ceiling: 16400, range: 940, fuelBurn: 35, climbFt: 1120 },

  // ----- Helicopters -----
  { icao: 'EC35', name: 'Airbus H135',         category: 'helicopter', manufacturer: 'Airbus',  engines: 2, mtow: 2910, oew: 1455, maxPax: 7, cruiseMach: 0.21, cruiseTas: 137, ceiling: 20000, range: 339, fuelBurn: 170, climbFt: 1880 },
  { icao: 'B412', name: 'Bell 412',            category: 'helicopter', manufacturer: 'Bell',    engines: 2, mtow: 5398, oew: 3160, maxPax: 13, cruiseMach: 0.20, cruiseTas: 122, ceiling: 20000, range: 402, fuelBurn: 280, climbFt: 1350 },
];

export const CATEGORY_LABELS = {
  airliner: 'Airliner',
  regional: 'Regional Jet',
  businessjet: 'Business Jet',
  turboprop: 'Turboprop',
  fighter: 'Fighter / Military',
  cargo: 'Cargo / Heavy',
  ga: 'General Aviation',
  helicopter: 'Helicopter',
};

export function getAircraft(icao) {
  return AIRCRAFT.find((a) => a.icao === (icao || '').toUpperCase());
}

export function groupedAircraft() {
  const groups = {};
  for (const a of AIRCRAFT) {
    (groups[a.category] ||= []).push(a);
  }
  return groups;
}
