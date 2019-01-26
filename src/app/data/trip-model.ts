import { Validators } from '@angular/forms';

export class City {
  cityName = [null, Validators.required ];
  range   = [null, Validators.required ];
  with  = '';
}


export class Transport {
    cityFrom = ['', Validators.required ];
    airportFrom = '';
    in = ['', Validators.required ];
    inTime = '';
    cityTo =    ['', Validators.required ];
    airportTo =    ['', Validators.required ];
    out =   ['', Validators.required ];
    outTime = '';
    carrier = '';
    flight ='';
}

