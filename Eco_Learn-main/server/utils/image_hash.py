from PIL import Image
import io
import math

# Perceptual hashing utilities (aHash and dHash) plus Hamming distance.
# Designed to work offline and be easy to explain during demos.


def average_hash(image: Image.Image, hash_size: int = 8) -> str:
    """Compute the average hash (aHash) of the given PIL Image.
    Steps:
      1. Convert to grayscale
      2. Resize to hash_size x hash_size
      3. Compute mean pixel value
      4. Each pixel > mean becomes 1 else 0 -> build bit string hex
    Returns a hex string.
    """
    img = image.convert('L').resize((hash_size, hash_size), Image.Resampling.LANCZOS)
    pixels = list(img.getdata())
    avg = sum(pixels) / len(pixels)
    bits = ''.join('1' if p > avg else '0' for p in pixels)
    # Convert bit string to hex
    return f"{int(bits, 2):0{hash_size * hash_size // 4}x}"


def difference_hash(image: Image.Image, hash_size: int = 8) -> str:
    """Compute the difference hash (dHash) of the given PIL Image.
    Steps:
      1. Convert to grayscale
      2. Resize to (hash_size + 1) x hash_size
      3. For each row, compare adjacent pixels left-to-right
      4. If left < right -> 1 else 0
    Returns hex string.
    """
    img = image.convert('L').resize((hash_size + 1, hash_size), Image.Resampling.LANCZOS)
    pixels = list(img.getdata())
    # Build difference bits
    bits = []
    for row in range(hash_size):
        row_start = row * (hash_size + 1)
        for col in range(hash_size):
            left_pix = pixels[row_start + col]
            right_pix = pixels[row_start + col + 1]
            bits.append('1' if left_pix < right_pix else '0')
    bit_string = ''.join(bits)
    return f"{int(bit_string, 2):0{hash_size * hash_size // 4}x}"


def hamming_distance(hash1: str, hash2: str) -> int:
    """Compute Hamming distance between two hex hash strings."""
    # Normalize length by padding shorter hash
    max_len = max(len(hash1), len(hash2))
    h1 = bin(int(hash1, 16))[2:].zfill(max_len * 4)
    h2 = bin(int(hash2, 16))[2:].zfill(max_len * 4)
    return sum(c1 != c2 for c1, c2 in zip(h1, h2))


def perceptual_hash(image: Image.Image, hash_size: int = 8, highfreq_factor: int = 4) -> str:
    """Compute pHash (perceptual hash) using pure Python DCT (no numpy).
    This avoids native build issues for demo environments.
    """
    size = hash_size * highfreq_factor
    img = image.convert('L').resize((size, size), Image.Resampling.LANCZOS)
    # Pixel matrix
    matrix = [list(img.crop((0, r, size, r + 1)).getdata()) for r in range(size)]

    def dct_1d(vector):
        N = len(vector)
        result = [0.0] * N
        factor = math.pi / (2 * N)
        sqrt_2_N = math.sqrt(2 / N)
        for k in range(N):
            coeff = 0.5 if k == 0 else 1.0
            acc = 0.0
            for n, val in enumerate(vector):
                acc += val * math.cos((2 * n + 1) * k * factor)
            result[k] = sqrt_2_N * coeff * acc
        return result

    # DCT rows
    dct_rows = [dct_1d(row) for row in matrix]
    # Transpose and DCT columns
    transposed = list(zip(*dct_rows))
    dct_cols = [dct_1d(list(col)) for col in transposed]
    # Transpose back
    dct_coeffs = [list(row) for row in zip(*dct_cols)]
    low_freq = [row[:hash_size] for row in dct_coeffs[:hash_size]]
    flat = [c for row in low_freq for c in row]
    median = sorted(flat[1:])[len(flat[1:]) // 2] if len(flat) > 1 else flat[0]
    bits = ''.join('1' if c > median else '0' for c in flat)
    return f"{int(bits, 2):0{hash_size * hash_size // 4}x}"


def compute_combined_hash(image_bytes: bytes) -> dict:
    """Compute aHash, dHash, and pHash, returning combined string for duplicate detection.
    Backward compatible: combined = aHash + dHash + pHash
    """
    image = Image.open(io.BytesIO(image_bytes))
    ah = average_hash(image)
    dh = difference_hash(image)
    try:
        ph = perceptual_hash(image)
    except Exception:
        ph = ''  # Fallback if pHash fails
    combined = ah + dh + ph
    return {"aHash": ah, "dHash": dh, "pHash": ph, "combined": combined}


def is_duplicate(new_hash: dict, existing_hashes: list, threshold: int = 5) -> bool:
    """Check if new_hash is a duplicate against any existing hashes using Hamming distance.
    existing_hashes: list of stored dicts with 'aHash' or 'dHash' or 'combined'
    We compare combined if available else aHash.
    """
    target = new_hash.get('combined') or (new_hash.get('aHash') + new_hash.get('dHash', ''))
    for h in existing_hashes:
        candidate = h.get('combined') or (h.get('aHash') + h.get('dHash', ''))
        if hamming_distance(target, candidate) <= threshold:
            return True
    return False
