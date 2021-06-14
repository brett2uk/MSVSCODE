/*--------------------------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See https://go.microsoft.com/fwlink/?linkid=2090316 for license information.
 *-------------------------------------------------------------------------------------------------------------*/

import { PackageInfo, ImageInfo, DistroInfo, Formatter } from '../domain/common'

export interface Component {
    Component: {
        Type: string;
        Linux?: {
            Name: string;
            Version: string;
            Distribution: string;
            Release: string;
            "Pool-URL": string;
            "Key-URL": string;
        },
        Npm?: {
            Name: string;
            Version: string;
        },
        Pip?: {
            Name: string;
            Version: string;
        }
        Git?: {
            Name: string;
            repositoryUrl: string;
            commitHash: string;
        },
        Other?: {
            Name: string;
            Version: string;
            DownloadUrl: string;
        },
        RubyGems?: {
            Name: string;
            Version: string;
        },
        Cargo?: {
            Name: string;
            Version: string;
        },
        Go?: {
            Name: string;
            Version: string;
        }
    }
}

/* Generate "Linux" entry for linux packages. E.g.
{
    "Component": {
    "Type": "linux",
    "Linux": {
        "Name": "yarn",
        "Version": "1.22.5-1",
        "Distribution": "Debian",
        "Release": "10",
        "Pool-URL": "https://dl.yarnpkg.com/debian",
        "Key-URL": "https://dl.yarnpkg.com/debian/pubkey.gpg"
    }
}
 */   
function linuxPackageComponentFormatter(packageInfo: PackageInfo, distroInfo: DistroInfo): Component {
    if (packageInfo.cgIgnore) {
        return null;
    }
    return {
        "Component": {
            "Type": "linux",
            "Linux": {
                "Name": packageInfo.name,
                "Version": packageInfo.version,
                "Distribution": distroInfo.id,
                "Release": distroInfo.versionId,
                "Pool-URL": packageInfo.poolUrl,
                "Key-URL": packageInfo.poolKeyUrl
            }
        }
    }
}


/* Generate "Npm" entries. E.g.
{
    "Component": {
        "Type": "npm",
        "Npm": {
            "Name": "eslint",
            "Version": "7.7.0"
        }
    }
}
*/
function npmComponentFormatter(packageInfo: PackageInfo): Component {
    if (packageInfo.cgIgnore) {
        return null;
    }
    return  {
        "Component": {
            "Type": "npm",
            "Npm": {
                "Name": packageInfo.name,
                "Version": packageInfo.version
            }
        }
    }
}


/* Generate "Pip" entries. E.g.
{
    "Component": {
        "Type": "Pip",
        "Pip": {
            "Name": "pylint",
            "Version": "2.6.0"
        }
    }
}
*/
function pipComponentFormatter(packageInfo: PackageInfo) {
    if (packageInfo.cgIgnore) {
        return null;
    }
    return  {
        "Component": {
            "Type": "Pip",
            "Pip": {
                "Name": packageInfo.name,
                "Version": packageInfo.version
            }
        }
    }
}


/* Generate "Git" entries. E.g.
{
    "Component": {
        "Type": "git",
        "Git": {
            "Name": "Oh My Zsh!",
            "repositoryUrl": "https://github.com/ohmyzsh/ohmyzsh.git",
            "commitHash": "cddac7177abc358f44efb469af43191922273705"
        }
    }
}
*/
function gitComponentFormatter(repositoryInfo: PackageInfo) {
    if (repositoryInfo.cgIgnore) {
        return null;
    }
    return {
        "Component": {
            "Type": "git",
            "Git": {
                "Name": repositoryInfo.name,
                "repositoryUrl": repositoryInfo.repositoryUrl,
                "commitHash": repositoryInfo.commitHash
            }
        }
    }
}

/* Generate "Other" entries. E.g.
{
    "Component": {
        "Type": "other",
        "Other": {
            "Name": "Xdebug",
            "Version": "2.9.6",
            "DownloadUrl": "https://pecl.php.net/get/xdebug-2.9.6.tgz"
        }
    }
}
*/
function otherComponentFormatter(componentInfo: PackageInfo) {
    if (componentInfo.cgIgnore) {
        return null;
    }
    return {
        "Component": {
            "Type": "other",
            "Other": {
                "Name": componentInfo.name,
                "Version": componentInfo.version,
                "DownloadUrl": componentInfo.downloadUrl
            }
        }
    }   
}

/* Generate "RubyGems" entries. E.g.
{
    "Component": {
        "Type": "RubyGems",
        "RubyGems": {
            "Name": "rake",
            "Version": "13.0.1"
        }
    }
}
*/
function gemComponentFormatter(packageInfo: PackageInfo) {
    if (packageInfo.cgIgnore) {
        return null;
    }
    return {
        "Component": {
            "Type": "RubyGems",
            "RubyGems": {
                "Name": packageInfo.name,
                "Version": packageInfo.version
            }
        }
    } 
}

/* Generate "Cargo" entries. E.g.
{
    "Component": {
        "Type": "cargo",
        "Cargo": {
            "Name": "rustfmt",
            "Version": "1.4.17-stable"
        }
    }
}
*/
function cargoComponentFormatter(packageInfo: PackageInfo) {
    if (packageInfo.cgIgnore) {
        return null;
    }
    return {
        "Component": {
            "Type": "cargo",
            "Cargo": {
                "Name": packageInfo.name,
                "Version": packageInfo.version
            }
        }
    }
}

/* Generate "Go" entries. E.g.
"Component": {
    "Type": "go",
    "Go": {
        "Name": "golang.org/x/tools/gopls",
        "Version": "0.6.4"
    }
}
*/
function goComponentFormatter(packageInfo: PackageInfo) {
    if (packageInfo.cgIgnore) {
        return null;
    }
    return {
        "Component": {
            "Type": "go",
            "Go": {
                "Name": packageInfo.name,
                "Version": packageInfo.version
            }
        }
    }
}

// Remove unused properties like markdownIgnore that only apply to other formatters
function manualComponentFormatter(component: any) {
    if (component.cgIgnore || component.CgIgnore || component.CGIgnore) {
        return null;
    }
    component.markdownIgnore = undefined;
    component.MarkdownIgnore = undefined;
    return component;       
}


export class ComponentFormatter implements Formatter {
    distroInfo: any;

    constructor(distroInfo: DistroInfo) {
        this.distroInfo = distroInfo;
    }

    image =  null;
    distro = null;
    linux (packageInfo: PackageInfo) { 
        return linuxPackageComponentFormatter(packageInfo, this.distroInfo);
    };
    npm = npmComponentFormatter;
    pip = pipComponentFormatter;
    pipx =  pipComponentFormatter;
    gem = gemComponentFormatter;
    cargo = cargoComponentFormatter;
    go = goComponentFormatter;
    git = gitComponentFormatter;
    other = otherComponentFormatter;
    languages = otherComponentFormatter;
    manual = manualComponentFormatter;
}
