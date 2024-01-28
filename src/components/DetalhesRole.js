import { Button} from 'react-native-paper';
import { FontAwesome5 } from '@expo/vector-icons';

const DetalhesRole =()  =>{
    return(
        <Button icon={({ size, color }) =>{
            return(
                <FontAwesome5 name="info-circle" size={size+2} color={'rgba(103, 80, 164, 0.8)'} />
            )
        }
        }
        />
    )
}

export default DetalhesRole;