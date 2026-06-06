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

# Take user resident registration numbers
user_RRN = input("Enter your resident registration numbers: ")

# Apply padding to user resident registration numbers
user_RRN = pad(bytes(user_RRN, 'utf-8'), 16)

# Encrypt user_RRN
ciphertext = encrypt(user_RRN)

# Write the ciphertext into the text file
f = open("encrypted_RRN.txt", 'wb')
f.write(ciphertext)
f.close()
