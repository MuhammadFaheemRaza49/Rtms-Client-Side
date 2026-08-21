
export const busDataFormation = (listData) => {
  const busCitiesList = []

  if (listData?.length===0) return

  for (let i = 0; i < listData?.length; i++) {
    const destination = []

    for (const dest of listData[i].destionation) {
      destination.push({
        id: dest.destination_city_id,
        name: dest.destination_city_name,
        nameu: dest.destination_city_name_urdu,
        short_name: dest.destination_short,
        lat:dest?.destination_lat,
        lng:dest?.destination_lng,
        is_connecting:dest?.is_connecting,
      })
    }
    busCitiesList.push({
      id: listData[i].origin_city_id,
      name: listData[i].origin_city_name,
      nameu: listData[i].origin_city_name_urdu,
      short_name: listData[i].origin_short,
      lat: listData[i]?.origin_lat,
      lng: listData[i]?.origin_lng,
      destination: destination
    })
  }

  return busCitiesList
}

export const busServiceListFormation = (listData) => {
    if(Array.isArray(listData) && listData.length > 0) {
        const servicesList = []

        for (let i = 0; i < listData.length; i++) {
            const departures = []
            for (const dep of listData[i].departure) {
                const destination = []
                for (const dest of dep.destionation) {
                    const dest_Obj = {
                        id: dest.destination_city_id,
                        name: dest.destination_city_name,
                        nameu: dest.destination_city_name_urdu,
                        commonId: dest.destination_common_id,
                        short_name: dest.destination_short,
                        lat: dest?.destination_lat,
                        lng: dest?.destination_lng,
                    }
                    destination.push(dest_Obj)
                }

                const dep_object = {
                    id: dep.origin_city_id,
                    name: dep.origin_city_name,
                    nameu: dep.origin_city_name_urdu,
                    short_name: dep.origin_short,
                    commonId: dep.origin_common_id,
                    lat: dep?.origin_lat,
                    lng: dep?.origin_lng,
                    destination: destination
                }

                departures.push(dep_object)
            }

            const object = {
                service_id: listData[i].service_id,
                service_name: listData[i].service_name,
                flexifare: listData[i].flexifare,
                departure: departures
            }

            servicesList.push(object)
        }

        return servicesList
    }else{
        const departures = []
        for (const dep of listData?.departure) {
            const destination = [];
            for (const dest of dep?.destionation) {
                const dest_Obj = {
                    id: dest?.destination_city_id,
                    name: dest?.destination_city_name,
                    nameu: dest?.destination_city_name_urdu,
                    commonId: dest?.destination_common_id,
                    short_name: dest?.destination_short,
                };
                destination.push(dest_Obj);
            }

            const dep_object = {
                id: dep.origin_city_id,
                name: dep.origin_city_name,
                nameu: dep.origin_city_name_urdu,
                short_name: dep.origin_short,
                commonId: dep.origin_common_id,
                destination: destination,
            };

            departures.push(dep_object);
        }


        return [{
            service_id: listData?.service_id,
            service_name: listData?.service_name,
            flexifare: listData?.flexifare,
            departure: departures
        }]
    }
}

export const busServiceFormation = (service) => {

  const departures = []
  for (const dep of service.departure) {
    const destination = []
    for (const dest of dep.destionation) {
      const dest_Obj = {
        id: dest.destination_city_id,
        name: dest.destination_city_name,
        nameu: dest.destination_city_name_urdu,
        commonId: dest.destination_common_id,
        short_name: dest.destination_short,
        lat:dest?.destination_lat,
        lng:dest?.destination_lng,
      }
      destination.push(dest_Obj)
    }

    const dep_object = {
      id: dep.origin_city_id,
      name: dep.origin_city_name,
      nameu: dep.origin_city_name_urdu,
      short_name: dep.origin_short,
      commonId: dep.origin_common_id,
      lat: dep?.origin_lat,
      lng: dep?.origin_lng,
      destination: destination
    }

    departures.push(dep_object)
  }

  return {
    service_id: service.service_id,
    service_name: service.service_name,
    flexifare: service.flexifare,
    departure: departures
  }
}
