// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Certificate {
    struct Cert {
        string ipfsHash;
        string courseId;
        bool exists;
    }

    // Mapping from user address to courseId to certificate
    mapping(address => mapping(string => Cert)) public certificates;

    event CertificateIssued(address indexed user, string courseId, string ipfsHash);

    function issueCertificate(
        string memory courseId,
        string memory ipfsHash
    ) public {
        require(!certificates[msg.sender][courseId].exists, "Certificate already exists");

        certificates[msg.sender][courseId] = Cert(ipfsHash, courseId, true);
        emit CertificateIssued(msg.sender, courseId, ipfsHash);
    }

    function verifyCertificate(
        address user,
        string memory courseId
    ) public view returns (string memory ipfsHash, bool valid) {
        Cert memory cert = certificates[user][courseId];
        return (cert.ipfsHash, cert.exists);
    }
}
