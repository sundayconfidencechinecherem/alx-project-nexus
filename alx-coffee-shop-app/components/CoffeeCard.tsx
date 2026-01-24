import { CoffeeCardProps } from "@/interface";
import { Image } from "expo-image";
import { StyleSheet,Text, View, TouchableOpacity } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCart } from "@/contexts/CartContext";


export default function CoffeeCard({
    imageSource,
    name,
    Amount,
    description,
    id,
    rating = 4.5,
}: CoffeeCardProps & { id: string }) {
    const router = useRouter();
    const { addToCart } = useCart();

    const handlePress = () => {
        router.push({
            pathname: "/shop/[id]",
            params: { 
                id,
                name,
                description,
                price: Amount.toString(),
                rating: rating.toString()
            }
        });
    };

    const handleAddToCart = (e: any) => {
        e.stopPropagation();
        addToCart({
            id: id || Date.now().toString(),
            name,
            description,
            price: Amount,
            rating
        }, "Medium");
    };

    return (
        <TouchableOpacity style={styles.container} onPress={handlePress}>
            <Image
                source={imageSource}
                style={styles.image}
                contentFit="cover"
            />
            <View style={styles.content}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.description} numberOfLines={2}>
                    {description}
                </Text>
                <View style={styles.footer}>
                    <View>
                        <Text style={styles.price}>${Amount.toFixed(2)}</Text>
                        <View style={styles.rating}>
                            <FontAwesome name="star" size={12} color="#FFD700" />
                            <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
                        </View>
                    </View>
                    <TouchableOpacity 
                        style={styles.addButton}
                        onPress={handleAddToCart}
                    >
                        <Ionicons name="add" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F1F3F5',
        marginBottom: 16,
    },
    image: {
        width: '100%',
        height: 140,
        borderRadius: 12,
        marginBottom: 12,
    },
    content: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2F2D2C',
        marginBottom: 4,
    },
    description: {
        fontSize: 13,
        color: '#666',
        marginBottom: 12,
        lineHeight: 18,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2F2D2C',
    },
    rating: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    ratingText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
    },
    addButton: {
        backgroundColor: '#C67C4E',
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
});