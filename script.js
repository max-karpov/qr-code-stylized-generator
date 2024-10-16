let logoPath = "";
let fileNameElement = document.getElementById("fileName");
let removeFileElement = document.getElementById("removeFile");

const qrCode = new QRCodeStyling({
  width: 1000,
  height: 1000,
  data: "https://example.com",
  dotsOptions: {
    color: "#e0e0e0",
    type: "square"
  },
  cornersSquareOptions: {
    color: "#e0e0e0",
    type: "square"
  },
  backgroundOptions: {
    color: "#121212"
  },
  image: "",
  imageOptions: {
    crossOrigin: "anonymous",
    margin: 100,
    imageSize: 0.6
  }
});

qrCode.append(document.getElementById("canvas"));

function updateQRCode() {
  const resolution = document.getElementById("resolution").value;
  const dotsColor = document.getElementById("dotsColor").value;
  const dotsType = document.getElementById("dotsType").value;
  const cornersColor = document.getElementById("cornersColor").value;
  const cornersType = document.getElementById("cornersType").value;
  const logoToggle = document.getElementById("logoToggle").checked;
  const logoSize = document.getElementById("logoSize").value;
  const data = document.getElementById("dataInput").value;
  const bgColor = document.getElementById("bgColor").value;
  const isTransparent = document.getElementById("transparentToggle").checked;

  document.getElementById("dotsColorHex").value = dotsColor.toUpperCase();
  document.getElementById("cornersColorHex").value = cornersColor.toUpperCase();
  document.getElementById("bgColorHex").value = bgColor.toUpperCase();

  if (!isTransparent) {
    document.body.classList.remove("transparent");
    document.body.style.backgroundColor = bgColor;
  } else {
    document.body.classList.add("transparent");
    document.body.style.backgroundColor = "transparent";
  }

  qrCode.update({
    width: resolution,
    height: resolution,
    data: data,
    dotsOptions: {
      color: dotsColor,
      type: dotsType
    },
    cornersSquareOptions: {
      color: cornersColor,
      type: cornersType
    },
    backgroundOptions: {
      color: isTransparent ? "rgba(0, 0, 0, 0)" : bgColor
    },
    image: logoToggle ? logoPath : "",
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 100,
      imageSize: logoSize
    }
  });
}

document.querySelectorAll('input, select').forEach((input) => {
  input.addEventListener('input', updateQRCode);
});

document.getElementById("logoFile").addEventListener("change", function(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      logoPath = e.target.result;
      fileNameElement.textContent = file.name;
      fileNameElement.style.display = "inline";
      removeFileElement.style.display = "inline";
      if (document.getElementById("logoToggle").checked) {
        updateQRCode();
      }
    };
    reader.readAsDataURL(file);
  }
});

removeFileElement.addEventListener("click", function() {
  logoPath = "";
  document.getElementById("logoFile").value = "";
  fileNameElement.textContent = "";
  removeFileElement.style.display = "none";
  updateQRCode();
});

// Перетаскивание окна
const qrCustomizer = document.querySelector(".qr-customizer");
qrCustomizer.style.position = "absolute";
let offsetX, offsetY;

function moveCustomizer(e) {
  qrCustomizer.style.left = `${e.clientX - offsetX}px`;
  qrCustomizer.style.top = `${e.clientY - offsetY}px`;
}

qrCustomizer.querySelector(".draggable").addEventListener("mousedown", (e) => {
  if (e.target.closest('button, input, select, label')) return; // Если кликнули на кнопку или другой элемент, не перетаскиваем
  e.preventDefault(); // Предотвращаем выделение текста при перетаскивании
  offsetX = e.clientX - qrCustomizer.getBoundingClientRect().left;
  offsetY = e.clientY - qrCustomizer.getBoundingClientRect().top;
  document.addEventListener("mousemove", moveCustomizer);
  document.addEventListener("mouseup", () => {
    document.removeEventListener("mousemove", moveCustomizer);
  });
});

// Кнопки для скачивания
document.getElementById("downloadPNG").addEventListener("click", function() {
  qrCode.download({ extension: "png" });
});

document.getElementById("downloadSVG").addEventListener("click", function() {
  qrCode.download({ extension: "svg" });
});
