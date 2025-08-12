const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Certificate contract", function () {
  let Certificate, certificate, owner, addr1;

  beforeEach(async function () {
    Certificate = await ethers.getContractFactory("Certificate");
    [owner, addr1] = await ethers.getSigners();
    certificate = await Certificate.deploy();
  });
  it("should issue a certificate", async function () {
    console.log("Certificate contract deployed at:", certificate.target);

    const courseId = "course-1";
    const ipfsHash = "QmTestHash";
    await expect(certificate.issueCertificate(courseId, ipfsHash))
      .to.emit(certificate, "CertificateIssued")
      .withArgs(owner.address, courseId, ipfsHash);
    const cert = await certificate.verifyCertificate(owner.address, courseId);
    expect(cert[0]).to.equal(ipfsHash);
    expect(cert[1]).to.equal(true);
  });

  it("should not allow duplicate certificates", async function () {
    const courseId = "course-1";
    const ipfsHash = "QmTestHash";
    await certificate.issueCertificate(courseId, ipfsHash);
    await expect(
      certificate.issueCertificate(courseId, ipfsHash)
    ).to.be.revertedWith("Certificate already exists");
  });

  it("should verify certificate for another user", async function () {
    const courseId = "course-2";
    const ipfsHash = "QmAnotherHash";
    await certificate.connect(addr1).issueCertificate(courseId, ipfsHash);
    const cert = await certificate.verifyCertificate(addr1.address, courseId);
    expect(cert[0]).to.equal(ipfsHash);
    expect(cert[1]).to.equal(true);
  });

  it("should return invalid for non-existent certificate", async function () {
    const cert = await certificate.verifyCertificate(owner.address, "non-existent");
    expect(cert[0]).to.equal("");
    expect(cert[1]).to.equal(false);
  });
});
