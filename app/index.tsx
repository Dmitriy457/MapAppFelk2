import { useState, useEffect } from "react";
import { StyleSheet, View, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useRouter } from 'expo-router';
import { useDatabase } from '@/contexts/DatabaseContext'; 

const myPoint = {
  latitude: 58.0102,
  longitude: 56.2283,
  latitudeDelta: 0.01,
  longitudeDelta: 0.005
}

function getMyStart () {
  return myPoint
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%'
  },
});

export default function App() {
  const [markers, setMarkers] = useState([]) // состояние для хранения маркеров

  const { addMarker, getMarkers, deleteMarker} = useDatabase();
  const router = useRouter()

  // Загружаем маркеры из базы данных
  useEffect(() => {
    const loadMarkers = async () => {
      const loadedMarkers = await getMarkers();
      setMarkers(loadedMarkers);
    };
    loadMarkers();
  }, [getMarkers]);  // зависимость от getMarkers, чтобы перезагрузить маркеры при изменении состояния

  const handleLongPress = async (e) => { 
    const coordinate = e.nativeEvent.coordinate; // извлекаем координаты из события долгого нажатия
    const existingMarkerIndex = markers.findIndex(marker =>
      marker.latitude === coordinate.latitude && marker.longitude === coordinate.longitude
    ); 
    // Проверяем, существует ли уже маркер с такими координатами
    if (existingMarkerIndex === -1) {
      const markerId = await addMarker(coordinate.latitude, coordinate.longitude); // добавляем маркер в базу данных
      setMarkers([...markers, { id: markerId, ...coordinate }]); // обновляем состояние маркеров
    } else {
      const markerId = markers[existingMarkerIndex].id; // получаем id существующего маркера
      await deleteMarker(markerId); // Удаляем маркер из базы данных
      setMarkers(markers.filter((_, index) => index !== existingMarkerIndex)); // обновляем состояние маркеров
    }
  };

  const handleMarkerPress = (coordinate) => {
    router.push(`/marker/${encodeURIComponent(JSON.stringify(coordinate))}`); // используем в качестве id json c координатами и переходим на экран маркера
  };

  // отрисовка маркеров на карте
  const markersRendered = markers.map((elem, idx) => (
    <Marker coordinate={elem} key={idx}
      onPress={() => handleMarkerPress(elem)}
    />
  ));

  return (
    <View style={styles.container}>
      <MapView style={styles.map}
        region={getMyStart()}
        onLongPress={handleLongPress}
        loadMarkers={true}
        
      >
        {markersRendered}
      </MapView>
    </View>
  );
}