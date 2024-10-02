import base64
#this is the method to use when want to decript the picture

def decode_image(encoded_image):
    try:
        # Decode the base64 image (if the frontend is only encoding it)
        decoded_image = base64.b64decode(encoded_image)
        return decoded_image
    except Exception as e:
        print("Error during decoding:", str(e))
        return None