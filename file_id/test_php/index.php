<?php
include('./vendor/autoload.php');

use danog\Decoder\FileId;
use danog\Decoder\UniqueFileId;

use function danog\Decoder\internalDecode;
use function danog\Decoder\rleEncode;

/*
$fileId = FileId::fromBotAPI('CQACAgIAAxkDAAIX7GEQO-oUQLoKIL3zwxT636VUmuUzAALpDwACwtyBSDWxGvZkPkc8IAQ');

$version = $fileId->getVersion(); // bot API file ID version, usually 4
$subVersion = $fileId->getSubVersion(); // bot API file ID subversion, equivalent to a specific tdlib version

$dcId = $fileId->getDcId(); // On which datacenter is this file stored

$type = $fileId->getType(); // File type
$typeName = $fileId->getTypeName(); // File type (as string)

$id = $fileId->getId();
$accessHash = $fileId->getAccessHash();

$fileReference = $fileId->getFileReference(); // File reference, https://core.telegram.org/api/file_reference
$url = $fileId->getUrl(); // URL, file IDs with encoded webLocation

// For photos, thumbnails if ($fileId->getType() <= PHOTO)
$volumeId = $fileId->getVolumeID();

print_r([
    $version,
    $subVersion,
    $dcId,
    $type,
    $typeName,
    $id,
    $accessHash,
    $fileReference,
    $url,
    $volumeId
]);/*/

print_r(internalDecode('CQACAgIAAxUAAWEdhNDQ_LpcSuZhpRh5u2f4U0VaAALIDwACtDrwSKCOdcG7GqMSIAQ'));
