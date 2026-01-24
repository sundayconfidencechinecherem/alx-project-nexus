import { Text, Pressable } from "react-native";
import { ButtonProps } from "@/interface";

export default function Button({ title, onPress, Btnstyling, Txtstyling }: ButtonProps) {
    return (
        <Pressable
            className={`${Btnstyling || "bg-[#C67C4E] py-3 px-10 rounded-lg"} flex justify-center items-center`}
            onPress={onPress}
        >
            <Text className={Txtstyling || "text-white font-bold text-[15px]"}>{title}</Text>
        </Pressable>
    );
};