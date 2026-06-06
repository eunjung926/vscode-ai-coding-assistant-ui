from Crypto.Cipher import AES
from Crypto.Util.Padding import pad

def encrypt(plaintext):
    """
    Purpose:
        Encrypt the given plaintext
    Arguments:
        plaintext: plaintext to be encrypted
    Return value:
        ciphertext: The encrypted plaintext
    Notes:
        - Encryption algorithm should be AES.
        - Encryption key, encryption mode and
          initial vector need to be properly set up.
        - The key length should be set to 16, 24,
          or 32 bytes long (you can use pad() function).
    """

# Take user input
user_data = input("Enter sensitive user data: ")

# Apply padding
user_data = pad(bytes(user_data, "utf-8"), 16)

# Encrypt
ciphertext = encrypt(user_data)

# Write the ciphertext into the text file
with open("encrypted_data.txt", "wb") as f:
    f.write(ciphertext)
