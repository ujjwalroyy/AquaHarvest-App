import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Button, Text, Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';

export default function SizeComponent() {
    const cameraRef = useRef(null);
    const [hasPermission, setHasPermission] = useState(null);
    const [imageUri, setImageUri] = useState(null);
    const [size, setSize] = useState({ width: null, height: null });

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const takePicture = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync({ base64: true });
            setImageUri(photo.uri);
            processImage(photo.uri);
        }
    };

    const processImage = async (uri) => {
        const actions = [{ resize: { width: 400, height: 300 } }];
        const result = await ImageManipulator.manipulateAsync(uri, actions, { 
            compress: 1, 
            format: ImageManipulator.SaveFormat.JPEG 
        });
        setImageUri(result.uri);

        if (window.cv) { // Ensure OpenCV is available
            const response = await fetch(result.uri);
            const blob = await response.blob();
            const imgElement = new Image();
            imgElement.src = URL.createObjectURL(blob);

            imgElement.onload = () => {
                const src = cv.imread(imgElement);
                const dst = new cv.Mat();
                
                cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
                cv.Canny(dst, dst, 50, 100);
                
                const contours = new cv.MatVector();
                const hierarchy = new cv.Mat();
                cv.findContours(dst, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

                const boundingBoxes = [];
                for (let i = 0; i < contours.size(); ++i) {
                    const box = cv.boundingRect(contours.get(i));
                    boundingBoxes.push(box);
                    cv.rectangle(dst, new cv.Point(box.x, box.y), new cv.Point(box.x + box.width, box.y + box.height), new cv.Scalar(255, 0, 0), 2);
                }

                if (boundingBoxes.length > 0) {
                    const largestBox = boundingBoxes.reduce((prev, current) => {
                        return (prev.width * prev.height > current.width * current.height) ? prev : current;
                    });
                    setSize({ width: largestBox.width, height: largestBox.height });
                } else {
                    setSize({ width: 0, height: 0 });
                }

                src.delete();
                dst.delete();
                contours.delete();
                hierarchy.delete();
            };
        } else {
            console.warn("OpenCV is not loaded yet.");
        }
    };

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            <Camera style={styles.camera} ref={cameraRef}>
                <View style={styles.buttonContainer}>
                    <Button title="Capture Fish" onPress={takePicture} />
                </View>
            </Camera>
            {imageUri && <Image source={{ uri: imageUri }} style={styles.preview} />}
            {size.width && (
                <Text style={styles.sizeText}>
                    Fish Size: {size.width} x {size.height} pixels
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    camera: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    buttonContainer: {
        flex: 0.1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    preview: {
        width: '100%',
        height: 200,
        marginVertical: 10,
    },
    sizeText: {
        fontSize: 20,
        color: 'green',
        margin: 10,
    },
});
