import base64 from 'base-64';
import pako from 'pako';
import { Alert } from 'react-native';

/**
 * データをGZIP圧縮してbase64エンコードする
 * @param {Object} data - 圧縮するデータ
 * @returns {string} - base64エンコードされた圧縮データ
 */
export const compressAndEncode = data => {
  try {
    // オブジェクトをJSON文字列に変換
    const jsonString = JSON.stringify(data);

    // GZIP圧縮
    const compressed = pako.gzip(jsonString);

    // Uint8Arrayをbase64に変換
    const base64String = base64.encode(String.fromCharCode.apply(null, compressed));

    return base64String;
  } catch (error) {
    console.error('圧縮・エンコードエラー:', error);
    Alert.alert('エラー', 'データの圧縮・エンコードに失敗しました');
    throw error;
  }
};

/**
 * base64デコードしてGZIP解凍する
 * @param {string} encodedData - base64エンコードされた圧縮データ
 * @returns {Object} - 解凍されたデータオブジェクト
 */
export const decodeAndDecompress = encodedData => {
  try {
    // base64デコード
    const decoded = base64.decode(encodedData);

    // 文字列をUint8Arrayに変換
    const uint8Array = new Uint8Array(decoded.split('').map(c => c.charCodeAt(0)));

    // GZIP解凍
    const decompressed = pako.ungzip(uint8Array, { to: 'string' });

    // JSON文字列をオブジェクトに変換
    return JSON.parse(decompressed);
  } catch (error) {
    console.error('解凍・デコードエラー:', error);
    Alert.alert('エラー', 'データの解凍・デコードに失敗しました');
    throw error;
  }
};

/**
 * インポートされたデータを検証する
 * @param {Object} data - 検証するデータ
 * @returns {boolean} - データが有効な場合はtrue
 */
export const validateImportData = data => {
  // 必須フィールドの存在確認
  const requiredFields = ['id', 'name', 'detail', 'questions', 'genres'];
  const hasAllFields = requiredFields.every(field => field in data);

  if (!hasAllFields) {
    Alert.alert('エラー', '無効なデータ形式です');
    return false;
  }

  // questions配列の検証
  if (!Array.isArray(data.questions)) {
    Alert.alert('エラー', '問題データの形式が不正です');
    return false;
  }

  // genres配列の検証
  if (!Array.isArray(data.genres)) {
    Alert.alert('エラー', 'ジャンルデータの形式が不正です');
    return false;
  }

  return true;
};
