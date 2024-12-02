import usePlaceRegisterStore from '@/stores/placeRegisterStore';
import exifr from 'exifr';

interface useUploadFilesProps {
  index: number;
}

const useRegisterFiles = ({ index }: useUploadFilesProps) => {
  const { setPlaceInput, removePartPlaceFile } = usePlaceRegisterStore();
  const MAX_CONTENT_COUNT = 3;
  const MAX_MEMORY = 30 * 1024 * 1024; // 30MB

  const handleFilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 파일 불러오는 로직
    const fileList = e.target.files;
    if (!fileList || fileList?.length === 0) return;

    // 불러온 파일 최대 3개로 제한
    const selectedFileList = Array.from(fileList).slice(0, MAX_CONTENT_COUNT);

    // 용량 제한 로직
    if (isOverMemory(selectedFileList)) {
      return;
    }

    // 서버에 전송할 파일 저장 로직
    setPlaceInput(index, 'file', selectedFileList);

    // meta data 추출 로직
    exportMetadata(selectedFileList);

    // 미리보기 파일 저장 로직
    const previewPromises = selectedFileList.map((file) => {
      return new Promise<string>((resolve) => {
        const fileReader = new FileReader();
        fileReader.onload = () => {
          const result = fileReader.result;
          resolve(typeof result === 'string' ? result : '');
        };
        fileReader.readAsDataURL(file);
      });
    });

    Promise.all(previewPromises).then((previewURLs) => {
      setPlaceInput(index, 'previewFile', previewURLs);
    });
  };

  const handlePartFileRemove = (index: number, previewIndex: number) => {
    removePartPlaceFile(index, previewIndex);
  };

  const isOverMemory = (selectedFileList: File[]) => {
    const totalMemory = selectedFileList.reduce(
      (acc, file) => acc + file.size,
      0
    );

    if (totalMemory >= MAX_MEMORY) {
      setPlaceInput(index, 'file', []);
      setPlaceInput(index, 'previewFile', []);
      alert('30MB를 초과하실 수 없습니다!');
      return true;
    }
    return false;
  };

  const exportMetadata = async (fileList: File[]) => {
    const gps = await exifr.gps(fileList[0]);
    if (gps) {
      // 위경도 저장
      setPlaceInput(index, 'lat', gps.latitude);
      setPlaceInput(index, 'lng', gps.longitude);

      // 도로명 주소 저장
      // 역지오코딩으로 도로명 주소 반환
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        { location: { lat: gps.latitude, lng: gps.longitude } },
        (results, status) => {
          if (status === 'OK' && results) {
            const address = results[0].formatted_address;
            setPlaceInput(index, 'address', address);
          } else {
            console.error('Geocoding failed:', status);
          }
        }
      );
    }
  };

  return {
    handleFilesUpload,
    handlePartFileRemove,
  };
};

export default useRegisterFiles;
